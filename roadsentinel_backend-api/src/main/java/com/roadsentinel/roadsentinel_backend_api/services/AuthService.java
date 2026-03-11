package com.roadsentinel.roadsentinel_backend_api.services;

import com.roadsentinel.roadsentinel_backend_api.dtos.UserDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.VerifyUserDTO;

public interface AuthService {
    UserDTO registerUser(UserDTO userDTO);

    void verifyUser(VerifyUserDTO input);

    void sendVerificationEmail(UserDTO user);

    void resendVerificationCode(String email);
    
    String generateVerificationCode();
}

