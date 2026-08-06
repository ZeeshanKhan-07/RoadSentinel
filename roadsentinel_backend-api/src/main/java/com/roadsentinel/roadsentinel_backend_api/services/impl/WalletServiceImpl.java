package com.roadsentinel.roadsentinel_backend_api.services.impl;

import org.springframework.stereotype.Service;

import com.roadsentinel.roadsentinel_backend_api.repositories.ComplaintRepository;
import com.roadsentinel.roadsentinel_backend_api.repositories.OrderRepository;
import com.roadsentinel.roadsentinel_backend_api.services.WalletService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final ComplaintRepository complaintRepository;

    private final OrderRepository orderRepository;

    @Override
    public Long getRemainingBalanceByEmail(String email) {
        Long earned = complaintRepository.sumRewardAmountByUserEmail(email);
        Long spent = orderRepository.sumTotalAmountByUserEmail(email);
        System.out.println("Earned Amount " + earned);
        System.out.println("Spent Amount " + spent);
        return Math.max(0, earned - spent);

    }
}
