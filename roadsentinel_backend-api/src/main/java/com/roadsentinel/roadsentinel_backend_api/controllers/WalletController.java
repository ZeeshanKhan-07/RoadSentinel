package com.roadsentinel.roadsentinel_backend_api.controllers;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/balance")
    public ResponseEntity<Long> getBalance(Authentication authentication) {
        String userEmail = authentication.getName();
        Long balance = walletService.getRemainingBalanceByEmail(userEmail);
        return ResponseEntity.ok(balance);
    }
}
