package com.roadsentinel.roadsentinel_backend_api.dtos;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductBarChartDTO {
    private UUID id;
    private String name;
    private int quantity;
}