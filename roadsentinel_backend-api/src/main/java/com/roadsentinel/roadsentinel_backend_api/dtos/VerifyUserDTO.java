package com.roadsentinel.roadsentinel_backend_api.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyUserDTO {
    private String email;
    private String verificationCode;
}
