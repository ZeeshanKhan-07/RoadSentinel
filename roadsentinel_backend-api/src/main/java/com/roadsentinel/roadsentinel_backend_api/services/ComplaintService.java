package com.roadsentinel.roadsentinel_backend_api.services;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintDTO;
import com.roadsentinel.roadsentinel_backend_api.enums.Status;

public interface ComplaintService{
    ComplaintDTO registerComplain(ComplaintDTO complaintDTO, List<MultipartFile> files);
    List<ComplaintDTO> getComplaintByUserId(UUID userId);
    long getTotalComplaints(UUID userId);
    long getTotalSuccessedComplaints(UUID userId);
    ComplaintDTO updateComplaintStatus(UUID complaintId, Status status);
    ComplaintDTO assignReward(UUID complaintId, Integer rewardAmount);
}