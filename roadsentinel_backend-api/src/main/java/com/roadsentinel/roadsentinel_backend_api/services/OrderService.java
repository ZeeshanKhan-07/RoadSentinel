package com.roadsentinel.roadsentinel_backend_api.services;

import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderRequestDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderResponseDTO;

public interface OrderService {
    OrderResponseDTO order(OrderRequestDTO request);
}
