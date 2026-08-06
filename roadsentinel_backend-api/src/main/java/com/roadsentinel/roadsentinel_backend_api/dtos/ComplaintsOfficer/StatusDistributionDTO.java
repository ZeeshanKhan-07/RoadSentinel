package com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusDistributionDTO {
    private double pendingPercentage;
    private double underReviewPercentage;
    private double approvedPercentage;
    private double rejectedPercentage;
}