package com.roadsentinel.roadsentinel_backend_api.services;

import jakarta.mail.MessagingException;

public interface EmailService {

    void sendVerificationEmail(String to, String subject, String text) throws MessagingException;
}
