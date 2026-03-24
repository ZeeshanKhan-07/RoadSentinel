package com.roadsentinel.roadsentinel_backend_api.dtos.order;

import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequestDTO {

    private UUID userId;

    private List<OrderItemRequestDTO> items;

    private AddressRequestDTO address;
}