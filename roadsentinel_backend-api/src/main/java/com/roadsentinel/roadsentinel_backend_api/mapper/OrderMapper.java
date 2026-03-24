package com.roadsentinel.roadsentinel_backend_api.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.roadsentinel.roadsentinel_backend_api.dtos.order.AddressResponse;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderItemResponse;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderResponseDTO;
import com.roadsentinel.roadsentinel_backend_api.entities.Address;
import com.roadsentinel.roadsentinel_backend_api.entities.OrderItem;
import com.roadsentinel.roadsentinel_backend_api.entities.Orders;

@Component
public class OrderMapper {

        public OrderResponseDTO mapToResponse(Orders order) {

                List<OrderItemResponse> items = order.getItems() != null
                                ? order.getItems().stream()
                                                .map((OrderItem item) -> OrderItemResponse.builder()
                                                                .productId(item.getProduct().getId())
                                                                .productName(item.getProduct().getName())
                                                                .quantity(item.getQuantity())
                                                                .price(item.getPrice())
                                                                .size(item.getSize())
                                                                .build())
                                                .toList()
                                : List.of();

                AddressResponse addressResponse = null;

                if (order.getAddress() != null) {
                        Address addr = order.getAddress();

                        addressResponse = AddressResponse.builder()
                                        .phone(addr.getPhone())
                                        .houseNo(addr.getHouseNo())
                                        .street(addr.getStreet())
                                        .locality(addr.getLocality())
                                        .landmark(addr.getLandmark())
                                        .city(addr.getCity())
                                        .state(addr.getState())
                                        .pincode(addr.getPincode())
                                        .country(addr.getCountry())
                                        .build();
                }

                return OrderResponseDTO.builder()
                                .orderId(order.getId())
                                .userId(order.getUser().getId())
                                .userName(order.getUser().getName())
                                .userEmail(order.getUser().getEmail())
                                .totalAmount(order.getTotalAmount())
                                .status(order.getStatus())
                                .createdAt(order.getCreatedAt())
                                .items(items)
                                .address(addressResponse)
                                .build();
        }
}