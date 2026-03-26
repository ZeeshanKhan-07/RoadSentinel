package com.roadsentinel.roadsentinel_backend_api.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
import com.roadsentinel.roadsentinel_backend_api.services.CloudinaryImageService;
import com.roadsentinel.roadsentinel_backend_api.services.ComplaintService;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final CloudinaryImageService cloudinaryImageService;

    @Override
    @Transactional
    public ComplaintDTO registerComplain(ComplaintDTO complaintDTO, List<MultipartFile> files) {
        Complaint complaint = modelMapper.map(complaintDTO, Complaint.class);

        User user = userRepository.findById(complaintDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        complaint.setUser(user);

        if (files != null && !files.isEmpty()) {

            for (MultipartFile file : files) {
                try {
                    Map uploadResult = cloudinaryImageService.upload(file);

                    String imageUrl = (String) uploadResult.get("secure_url");
                    String publicId = (String) uploadResult.get("public_id");

                    Attachment attachment = new Attachment();
                    attachment.setImageUrl(imageUrl);
                    attachment.setPublicId(publicId);

                    // 🔥 THIS LINE FIXES EVERYTHING
                    complaint.addAttachment(attachment);

                } catch (IOException e) {
                    throw new RuntimeException("Failed to store file " + e.getMessage());
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

    @Override
    public long getTotalSuccessedComplaints(UUID userId) {
        long count = complaintRepository.countByUserIdAndRewardAmountGreaterThanOne(userId);
        return count;
    }

}
