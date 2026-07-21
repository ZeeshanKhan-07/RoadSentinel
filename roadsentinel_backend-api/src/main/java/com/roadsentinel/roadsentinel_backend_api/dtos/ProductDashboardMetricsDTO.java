package com.roadsentinel.roadsentinel_backend_api.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductDashboardMetricsDTO {
    private long totalUniqueProducts;
    private long soldProductsCount;
    private long toBeDeliveredCount;
}