package com.roadsentinel.roadsentinel_backend_api.dtos;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import com.roadsentinel.roadsentinel_backend_api.enums.Provider;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private UUID id;

    private String email;

    private String name;

    private String password;

    private String profile_img;

    private boolean enable = true;

    private Instant createdAt = Instant.now();

    private Instant updatedAt = Instant.now();

    private Provider provider = Provider.LOCAL;

    private String verificationCode;

    private LocalDateTime verificationCodeExpiration;

    private Set<RoleDTO> roles = new HashSet<>();
}
