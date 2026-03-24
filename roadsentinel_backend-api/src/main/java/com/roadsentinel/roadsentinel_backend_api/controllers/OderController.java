package com.roadsentinel.roadsentinel_backend_api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderRequestDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderResponseDTO;
import com.roadsentinel.roadsentinel_backend_api.services.OrderService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/order")
@AllArgsConstructor
public class OderController {

    private final OrderService orderService;

    @PostMapping("/placeOrder")
    public ResponseEntity<OrderResponseDTO> placeOrder(@RequestBody OrderRequestDTO requestDTO) {
        return ResponseEntity.ok(orderService.order(requestDTO));
    }
}
