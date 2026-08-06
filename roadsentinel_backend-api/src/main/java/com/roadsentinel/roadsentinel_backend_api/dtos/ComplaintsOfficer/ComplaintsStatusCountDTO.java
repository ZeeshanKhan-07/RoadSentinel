package com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintsStatusCountDTO {
    private long pending;
    private long underReview;
    private long approved;
    private long rejected;
}