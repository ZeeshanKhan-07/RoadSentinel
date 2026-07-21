package com.roadsentinel.roadsentinel_backend_api.dtos.order;

import java.time.Instant;
import java.util.UUID;

import com.roadsentinel.roadsentinel_backend_api.dtos.OrderStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderStatusUpdateResponseDTO {
    private UUID orderId;
    private OrderStatus status;
    private Instant updatedAt;
}