package com.roadsentinel.roadsentinel_backend_api.dtos.order;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRequestDTO {

    private UUID productId;
    private int quantity;
    private String size;
}
