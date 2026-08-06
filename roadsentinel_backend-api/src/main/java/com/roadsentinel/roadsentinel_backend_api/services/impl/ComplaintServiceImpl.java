package com.roadsentinel.roadsentinel_backend_api.services.impl;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.CityCountDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.ComplaintsStatusCountDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.DashboardSummaryDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.StatusDistributionDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.UserInfoDTO;
import com.roadsentinel.roadsentinel_backend_api.entities.Attachment;
import com.roadsentinel.roadsentinel_backend_api.entities.Complaint;
import com.roadsentinel.roadsentinel_backend_api.entities.User;
import com.roadsentinel.roadsentinel_backend_api.enums.Status;
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
    public ComplaintDTO registerComplain(ComplaintDTO complaintDTO, List<MultipartFile> files) {

        List<Attachment> attachments = new ArrayList<>();

        if (files != null && !files.isEmpty()) {
            attachments = files.parallelStream()
                    .filter(file -> file != null && !file.isEmpty())
                    .map(file -> {
                        try {
                            Map uploadResult = cloudinaryImageService.upload(file);

                            String imageUrl = (String) uploadResult.get("secure_url");
                            String publicId = (String) uploadResult.get("public_id");

                            Attachment attachment = new Attachment();
                            attachment.setImageUrl(imageUrl);
                            attachment.setPublicId(publicId);

                            return attachment;
                        } catch (Exception e) {
                            throw new RuntimeException("Failed to upload image to Cloudinary: " + e.getMessage(), e);
                        }
                    })
                    .collect(Collectors.toList());
        }

        // Pass pre-uploaded attachments list to transactional DB method
        return saveComplaintToDatabase(complaintDTO, attachments);
    }

    // 2. TRANSACTIONAL HELPER: Saves Complaint and Attachment entities to MySQL
    @Transactional
    public ComplaintDTO saveComplaintToDatabase(ComplaintDTO complaintDTO, List<Attachment> attachments) {
        Complaint complaint = modelMapper.map(complaintDTO, Complaint.class);

        User user = userRepository.findById(complaintDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + complaintDTO.getUserId()));
        complaint.setUser(user);

        // Attach pre-uploaded media attachments
        if (attachments != null && !attachments.isEmpty()) {
            for (Attachment attachment : attachments) {
                complaint.addAttachment(attachment);
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

    @Override
    @Transactional
    public ComplaintDTO updateComplaintStatus(UUID complaintId, Status status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

        complaint.setStatus(status);

        Complaint updatedComplaint = complaintRepository.save(complaint);

        ComplaintDTO dto = modelMapper.map(updatedComplaint, ComplaintDTO.class);
        if (updatedComplaint.getUser() != null) {
            dto.setUserId(updatedComplaint.getUser().getId());
        }
        return dto;
    }

    @Override
    @Transactional
    public ComplaintDTO assignReward(UUID complaintId, Integer rewardAmount) {
        if (rewardAmount == null || rewardAmount < 0) {
            throw new IllegalArgumentException("Reward amount must be positive");
        }

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

        complaint.setRewardAmount(rewardAmount);

        if (complaint.getStatus() == null || complaint.getStatus() != Status.APPROVED) {
            complaint.setStatus(Status.APPROVED);
        }

        Complaint updatedComplaint = complaintRepository.save(complaint);

        ComplaintDTO dto = modelMapper.map(updatedComplaint, ComplaintDTO.class);
        if (updatedComplaint.getUser() != null) {
            dto.setUserId(updatedComplaint.getUser().getId());
        }
        return dto;
    }

    @Override
    public List<ComplaintDTO> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(complaint -> {
                    ComplaintDTO dto = modelMapper.map(complaint, ComplaintDTO.class);
                    if (complaint.getUser() != null) {
                        dto.setUserId(complaint.getUser().getId());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ComplaintsStatusCountDTO getStatusCounts() {
        return ComplaintsStatusCountDTO.builder()
                .pending(complaintRepository.countByStatus(Status.PENDING))
                .underReview(complaintRepository.countByStatus(Status.UNDER_REVIEW))
                .approved(complaintRepository.countByStatus(Status.APPROVED))
                .rejected(complaintRepository.countByStatus(Status.REJECTED))
                .build();
    }

    @Override
    public StatusDistributionDTO getStatusDistribution() {
        long total = complaintRepository.count();
        if (total == 0) {
            return new StatusDistributionDTO(0.0, 0.0, 0.0, 0.0);
        }

        ComplaintsStatusCountDTO counts = getStatusCounts();

        return StatusDistributionDTO.builder()
                .pendingPercentage(roundTwoDecimals(((double) counts.getPending() / total) * 100))
                .underReviewPercentage(roundTwoDecimals(((double) counts.getUnderReview() / total) * 100))
                .approvedPercentage(roundTwoDecimals(((double) counts.getApproved() / total) * 100))
                .rejectedPercentage(roundTwoDecimals(((double) counts.getRejected() / total) * 100))
                .build();
    }

    @Override
    public List<CityCountDTO> getComplaintsByCity() {
        return complaintRepository.countComplaintsByCity().stream()
                .map(p -> new CityCountDTO(p.getCity(), p.getCount()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintDTO> getRecentComplaints(int limit) {
        return complaintRepository.findByOrderByRaisedAtDesc(PageRequest.of(0, limit)).stream()
                .map(complaint -> {
                    ComplaintDTO dto = modelMapper.map(complaint, ComplaintDTO.class);
                    if (complaint.getUser() != null) {
                        dto.setUserId(complaint.getUser().getId());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public DashboardSummaryDTO getDashboardSummary() {
        long totalComplaints = complaintRepository.count();

        Instant startOfToday = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();

        Instant startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        return DashboardSummaryDTO.builder()
                .totalComplaints(totalComplaints)
                .statusCounts(getStatusCounts())
                .totalRewardsIssued(complaintRepository.sumTotalRewardsIssued())
                .todayComplaints(complaintRepository.countByRaisedAtAfter(startOfToday))
                .thisMonthComplaints(complaintRepository.countByRaisedAtAfter(startOfMonth))
                .statusDistribution(getStatusDistribution())
                .complaintsByCity(getComplaintsByCity())
                .recentComplaints(getRecentComplaints(5))
                .build();
    }

    private double roundTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    @Override
    public UserInfoDTO getUserByComplaintId(UUID complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

        User user = complaint.getUser();
        if (user == null) {
            throw new RuntimeException("No user associated with complaint ID: " + complaintId);
        }

        return modelMapper.map(user, UserInfoDTO.class);
    }

}
