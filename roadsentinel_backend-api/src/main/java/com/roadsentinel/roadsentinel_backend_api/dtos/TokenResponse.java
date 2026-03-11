package com.roadsentinel.roadsentinel_backend_api.dtos;

public record TokenResponse (
    String accessToken,
    String refreshToken,
    long expiresIn,
    String tokenType,
    UserDTO user
) {
    public static TokenResponse of(String accessToken, String refreshToken, long expiresIn, UserDTO user) {
        return new TokenResponse(accessToken, refreshToken, expiresIn, "Bearer", user);
    }
}
