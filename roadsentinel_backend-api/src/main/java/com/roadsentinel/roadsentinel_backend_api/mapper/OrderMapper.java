package com.roadsentinel.roadsentinel_backend_api.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.roadsentinel.roadsentinel_backend_api.dtos.order.AddressResponse;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderItemResponse;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderResponseDTO;
import com.roadsentinel.roadsentinel_backend_api.entities.Address;
import com.roadsentinel.roadsentinel_backend_api.entities.OrderItem;
import com.roadsentinel.roadsentinel_backend_api.entities.Orders;
import com.roadsentinel.roadsentinel_backend_api.entities.ProductImage;

@Component
public class OrderMapper {

        public OrderResponseDTO mapToResponse(Orders order) {
                if (order == null) {
                        return null;
                }

                List<OrderItemResponse> items = order.getItems() != null
                                ? order.getItems().stream()
                                                .map((OrderItem item) -> {
                                                        // Extract product image URLs safely
                                                        List<String> imageUrls = (item.getProduct() != null
                                                                        && item.getProduct().getImages() != null)
                                                                                        ? item.getProduct().getImages()
                                                                                                        .stream()
                                                                                                        .map(ProductImage::getImageUrl)
                                                                                                        .toList()
                                                                                        : List.of();

                                                        return OrderItemResponse.builder()
                                                                        .productId(item.getProduct() != null
                                                                                        ? item.getProduct().getId()
                                                                                        : null)
                                                                        .productName(item.getProduct() != null
                                                                                        ? item.getProduct().getName()
                                                                                        : null)
                                                                        .quantity(item.getQuantity())
                                                                        .price(item.getPrice())
                                                                        .size(item.getSize())
                                                                        .images(imageUrls) // Added product images
                                                                                           // mapping
                                                                        .build();
                                                })
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
                                .userId(order.getUser() != null ? order.getUser().getId() : null)
                                .userName(order.getUser() != null ? order.getUser().getName() : null)
                                .userEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                                .totalAmount(order.getTotalAmount())
                                .status(order.getStatus())
                                .createdAt(order.getCreatedAt())
                                .items(items)
                                .address(addressResponse)
                                .build();
        }
}