package com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer;

import java.util.List;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private long totalComplaints;
    private ComplaintsStatusCountDTO statusCounts;
    private long totalRewardsIssued;
    private long todayComplaints;
    private long thisMonthComplaints;
    private StatusDistributionDTO statusDistribution;
    private List<CityCountDTO> complaintsByCity;
    private List<ComplaintDTO> recentComplaints;
}