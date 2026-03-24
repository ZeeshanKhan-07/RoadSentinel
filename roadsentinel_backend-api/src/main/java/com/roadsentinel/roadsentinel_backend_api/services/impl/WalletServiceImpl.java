package com.roadsentinel.roadsentinel_backend_api.services.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.roadsentinel.roadsentinel_backend_api.repositories.ComplaintRepository;
import com.roadsentinel.roadsentinel_backend_api.repositories.OrderRepository;
import com.roadsentinel.roadsentinel_backend_api.services.WalletService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class WalletServiceImpl implements WalletService{

    private final ComplaintRepository complaintRepository;

    private final OrderRepository orderRepository; 


    @Override
    public Long getRemainingBalance(UUID userId) {
        Long totalEarned = complaintRepository.sumRewardAmountByUserId(userId);
        Long totalSpent = orderRepository.sumTotalAmountByUserId(userId);

        long earned = (totalEarned != null) ? totalEarned : 0L;
        long spent = (totalSpent != null) ? totalSpent : 0L;

        return earned - spent;
    }
    
}
