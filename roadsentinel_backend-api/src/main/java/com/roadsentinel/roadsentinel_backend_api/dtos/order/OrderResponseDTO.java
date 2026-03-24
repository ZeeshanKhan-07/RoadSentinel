package com.roadsentinel.roadsentinel_backend_api.dtos.order;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.roadsentinel.roadsentinel_backend_api.dtos.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {

    private UUID orderId;

    private UUID userId;

    private String userName;
    
    private String userEmail;

    private long totalAmount;

    private OrderStatus status;

    private Instant createdAt;

    private List<OrderItemResponse> items;

    private AddressResponse address;
}
