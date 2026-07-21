package com.roadsentinel.roadsentinel_backend_api.dtos.order;

import com.roadsentinel.roadsentinel_backend_api.dtos.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OrderStatusMetricDTO {
    private OrderStatus status;
    private long count;
}