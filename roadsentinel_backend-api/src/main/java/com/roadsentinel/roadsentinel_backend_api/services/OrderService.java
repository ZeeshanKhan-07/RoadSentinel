package com.roadsentinel.roadsentinel_backend_api.services;

import java.util.List;
import java.util.UUID;

import com.roadsentinel.roadsentinel_backend_api.dtos.OrderStatus;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderRequestDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderResponseDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderStatusUpdateResponseDTO;

public interface OrderService {
    OrderResponseDTO order(OrderRequestDTO request);
    OrderStatusUpdateResponseDTO updateOrderStatus(UUID orderId, OrderStatus status);
    List<OrderResponseDTO> getAllOrders();
}
