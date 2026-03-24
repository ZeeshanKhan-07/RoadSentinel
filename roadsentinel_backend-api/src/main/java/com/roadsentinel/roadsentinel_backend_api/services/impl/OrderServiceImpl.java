package com.roadsentinel.roadsentinel_backend_api.services.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.roadsentinel.roadsentinel_backend_api.dtos.OrderStatus;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.AddressRequestDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderItemRequestDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderRequestDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderResponseDTO;
import com.roadsentinel.roadsentinel_backend_api.entities.Address;
import com.roadsentinel.roadsentinel_backend_api.entities.OrderItem;
import com.roadsentinel.roadsentinel_backend_api.entities.Orders;
import com.roadsentinel.roadsentinel_backend_api.entities.Products;
import com.roadsentinel.roadsentinel_backend_api.entities.User;
import com.roadsentinel.roadsentinel_backend_api.mapper.OrderMapper;
import com.roadsentinel.roadsentinel_backend_api.repositories.OrderRepository;
import com.roadsentinel.roadsentinel_backend_api.repositories.ProductRepository;
import com.roadsentinel.roadsentinel_backend_api.repositories.UserRepository;
import com.roadsentinel.roadsentinel_backend_api.services.OrderService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final OrderMapper orderMapper;

    private final OrderRepository orderRepository;

    @Override
    public OrderResponseDTO order(OrderRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Orders order = new Orders();
        order.setUser(user);
        order.setStatus(OrderStatus.CONFIRMED);

        List<OrderItem> orderItems = new ArrayList<>();
        long totalAmount = 0;

        for (OrderItemRequestDTO itemDTO : request.getItems()) {

            Products product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getQuantity() < itemDTO.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());
            item.setPrice(product.getPrice());
            if (itemDTO.getSize() != null) {
                item.setSize(itemDTO.getSize());
            }

            totalAmount += product.getPrice() * itemDTO.getQuantity();

            product.setQuantity(product.getQuantity() - itemDTO.getQuantity());

            orderItems.add(item);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        AddressRequestDTO addrDTO = request.getAddress();

        Address address = new Address();
        address.setPhone(addrDTO.getPhone());
        address.setHouseNo(addrDTO.getHouseNo());
        address.setStreet(addrDTO.getStreet());
        address.setLocality(addrDTO.getLocality());
        address.setLandmark(addrDTO.getLandmark());
        address.setCity(addrDTO.getCity());
        address.setState(addrDTO.getState());
        address.setPincode(addrDTO.getPincode());
        address.setCountry(addrDTO.getCountry());

        order.setAddress(address);

        Orders savedOrder = orderRepository.save(order);

        return orderMapper.mapToResponse(savedOrder);
    }

}
