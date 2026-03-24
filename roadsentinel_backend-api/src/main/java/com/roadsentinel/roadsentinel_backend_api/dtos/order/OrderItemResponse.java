package com.roadsentinel.roadsentinel_backend_api.dtos.order;

import java.util.UUID;

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
public class OrderItemResponse {

    private UUID productId;
    private String productName;

    private int quantity;
    private long price;
    private String size;
}