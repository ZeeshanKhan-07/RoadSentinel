package com.roadsentinel.roadsentinel_backend_api.controllers;

import java.time.LocalDateTime;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roadsentinel.roadsentinel_backend_api.dtos.LoginRequest;
import com.roadsentinel.roadsentinel_backend_api.dtos.TokenResponse;
import com.roadsentinel.roadsentinel_backend_api.dtos.UserDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.VerifyAdminDto;
import com.roadsentinel.roadsentinel_backend_api.entities.RefreshToken;
import com.roadsentinel.roadsentinel_backend_api.entities.Role;
import com.roadsentinel.roadsentinel_backend_api.entities.User;
import com.roadsentinel.roadsentinel_backend_api.repositories.RefreshTokenRepository;
import com.roadsentinel.roadsentinel_backend_api.repositories.UserRepository;
import com.roadsentinel.roadsentinel_backend_api.security.JwtService;
import com.roadsentinel.roadsentinel_backend_api.services.AuthService;
import com.roadsentinel.roadsentinel_backend_api.services.CookieService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/admin/auth")
@AllArgsConstructor
public class AdminAuthController {

        private final UserRepository userRepository;
        private final AuthService authService;
        private final ModelMapper modelMapper;
        private final JwtService jwtService;
        private final RefreshTokenRepository refreshTokenRepository;
        private final CookieService cookieService;
        private final AuthenticationManager authenticationManager;

        @PostMapping("/login")
        public ResponseEntity<?> login(
                        @RequestBody LoginRequest loginRequest,
                        HttpServletResponse response) {

                authenticate(loginRequest);

                User user = userRepository.findByEmail(loginRequest.email())
                                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

                if (!user.isEnable()) {
                        throw new DisabledException("User is disabled");
                }

                boolean isAdmin = user.getRoles()
                                .stream()
                                .anyMatch(role -> "ROLE_PRODUCT_ADMIN".equals(role.getName()));

                if (!isAdmin) {
                        throw new BadCredentialsException("Access denied. Admin privileges required.");
                }

                // Generate OTP
                String otp = authService.generateVerificationCode();

                user.setVerificationCode(otp);
                user.setVerificationCodeExpiration(LocalDateTime.now().plusMinutes(5));
                userRepository.save(user);

                authService.sendVerificationEmail(
                                modelMapper.map(user, UserDTO.class));

                return ResponseEntity.ok(
                                Map.of(
                                                "requiresOtp", true,
                                                "message", "OTP sent to admin email. Please verify to login"));
        }

        private Authentication authenticate(LoginRequest loginRequest) {
                try {
                        return authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        loginRequest.email(),
                                                        loginRequest.password()));
                } catch (Exception e) {
                        throw new BadCredentialsException(
                                        "Invalid email or password",
                                        e);
                }
        }

        @PostMapping("/verify-login")
        public ResponseEntity<TokenResponse> verifyAdminLogin(
                        @RequestBody VerifyAdminDto dto,
                        HttpServletResponse response) {

                User user = userRepository.findByEmail(dto.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (user.getVerificationCode() == null
                                || !user.getVerificationCode().equals(dto.getVerificationCode())) {
                        throw new RuntimeException("Invalid OTP");
                }

                if (user.getVerificationCodeExpiration() == null
                                || user.getVerificationCodeExpiration().isBefore(LocalDateTime.now())) {
                        throw new RuntimeException("OTP expired");
                }

                user.setVerificationCode(null);
                user.setVerificationCodeExpiration(null);
                userRepository.save(user);

                String jti = UUID.randomUUID().toString();

                RefreshToken refreshTokenOb = RefreshToken.builder()
                                .jti(jti)
                                .user(user)
                                .createdAt(Instant.now())
                                .expiresAt(
                                                Instant.now()
                                                                .plusMillis(jwtService.getRefreshTokenExpiration()))
                                .revoked(false)
                                .build();

                refreshTokenRepository.save(refreshTokenOb);

                String accessToken = jwtService.generateAccessToken(user);
                String refreshToken = jwtService.generateRefreshToken(
                                user,
                                refreshTokenOb.getJti());

                cookieService.attachRefreshCookie(
                                response,
                                refreshToken,
                                (int) jwtService.getRefreshTokenExpiration());

                cookieService.addNoStoreHeaders(response);

                return ResponseEntity.ok(
                                TokenResponse.of(
                                                accessToken,
                                                refreshToken,
                                                jwtService.getAccessTokenExpiration(),
                                                modelMapper.map(user, UserDTO.class)));
        }
}