package com.roadsentinel.roadsentinel_backend_api.dtos;

public record LoginRequest (
    String email,
    String password
) {
    
}
