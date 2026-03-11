package com.roadsentinel.roadsentinel_backend_api.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.roadsentinel.roadsentinel_backend_api.exceptions.ResourceNotFoundException;
import com.roadsentinel.roadsentinel_backend_api.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    //this method will used when dao authentication provider will call loadUserByUsername method to get user details for authentication
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Email or Password!!"));
    }
}
