package com.roadsentinel.roadsentinel_backend_api.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintDTO;
import com.roadsentinel.roadsentinel_backend_api.entities.Attachment;
import com.roadsentinel.roadsentinel_backend_api.entities.Complaint;
import com.roadsentinel.roadsentinel_backend_api.entities.User;
import com.roadsentinel.roadsentinel_backend_api.repositories.ComplaintRepository;
import com.roadsentinel.roadsentinel_backend_api.repositories.UserRepository;
import com.roadsentinel.roadsentinel_backend_api.services.ComplaintService;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public ComplaintDTO registerComplain(ComplaintDTO complaintDTO, List<MultipartFile> files) {
        Complaint complaint = modelMapper.map(complaintDTO, Complaint.class);

        User user = userRepository.findById(complaintDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        complaint.setUser(user);

        if (files != null && !files.isEmpty()) {
            String uploadDir = "uploads/complaints/";

            for (MultipartFile file : files) {
                try {
                    Path uploadPath = Paths.get(uploadDir);
                    if (!Files.exists(uploadPath))
                        Files.createDirectories(uploadPath);

                    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Path filePath = uploadPath.resolve(fileName);

                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    Attachment attachment = new Attachment();
                    attachment.setFileUrl("/uploads/complaints/" + fileName);
                    attachment.setFileType(file.getContentType());

                    complaint.addAttachment(attachment);

                } catch (IOException e) {
                    throw new RuntimeException("Failed to store file", e);
                }
            }
        }

        Complaint savedComplaint = complaintRepository.save(complaint);

        ComplaintDTO savedDTO = modelMapper.map(savedComplaint, ComplaintDTO.class);
        savedDTO.setUserId(user.getId());
        return savedDTO;
    }

    @Override
    public List<ComplaintDTO> getComplaintByUserId(UUID userId) {
        List<Complaint> complaints = complaintRepository.findByUserId(userId);

        return complaints.stream()
                .map(complaint -> {
                    ComplaintDTO dto = modelMapper.map(complaint, ComplaintDTO.class);
                    dto.setUserId(userId);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public long getTotalComplaints(UUID userId) {
        long total = complaintRepository.countByUserId(userId);
        return total;
    }

}
