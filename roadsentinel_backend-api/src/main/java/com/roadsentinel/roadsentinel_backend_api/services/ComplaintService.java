package com.roadsentinel.roadsentinel_backend_api.services;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.CityCountDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.ComplaintsStatusCountDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.DashboardSummaryDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.StatusDistributionDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.UserInfoDTO;
import com.roadsentinel.roadsentinel_backend_api.enums.Status;

public interface ComplaintService {
    ComplaintDTO registerComplain(ComplaintDTO complaintDTO, List<MultipartFile> files);

    List<ComplaintDTO> getComplaintByUserId(UUID userId);

    long getTotalComplaints(UUID userId);

    long getTotalSuccessedComplaints(UUID userId);

    ComplaintDTO updateComplaintStatus(UUID complaintId, Status status);

    ComplaintDTO assignReward(UUID complaintId, Integer rewardAmount);

    DashboardSummaryDTO getDashboardSummary();

    List<ComplaintDTO> getAllComplaints();

    ComplaintsStatusCountDTO getStatusCounts();

    List<CityCountDTO> getComplaintsByCity();

    StatusDistributionDTO getStatusDistribution();

    List<ComplaintDTO> getRecentComplaints(int limit);

    UserInfoDTO getUserByComplaintId(UUID complaintId);
}