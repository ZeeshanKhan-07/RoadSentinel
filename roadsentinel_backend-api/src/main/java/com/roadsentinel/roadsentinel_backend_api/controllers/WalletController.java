package com.roadsentinel.roadsentinel_backend_api.controllers;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roadsentinel.roadsentinel_backend_api.services.WalletService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/wallet")
@AllArgsConstructor
public class WalletController {
    private final WalletService walletService;

    @PostMapping("/balance")
    public ResponseEntity<Long> getBalance(@RequestBody Map<String, UUID> request) {
        UUID userId = request.get("userId");

        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        Long balance = walletService.getRemainingBalance(userId);
        return ResponseEntity.ok(balance);
    }
}
