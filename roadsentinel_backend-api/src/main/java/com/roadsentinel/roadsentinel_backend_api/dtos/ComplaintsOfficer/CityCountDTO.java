package com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CityCountDTO {
    private String city;
    private long count;
}
