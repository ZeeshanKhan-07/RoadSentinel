package com.roadsentinel.roadsentinel_backend_api.services;

import java.util.UUID;

public interface WalletService {

    Long getRemainingBalance(UUID userId);

}