package com.roadsentinel.roadsentinel_backend_api.dtos;

import org.springframework.http.HttpStatus;

public record ErrorResponse(
        String message,
        HttpStatus status,
        int statusCode) {
}
