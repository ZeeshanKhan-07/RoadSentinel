package com.roadsentinel.roadsentinel_backend_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;

import com.roadsentinel.roadsentinel_backend_api.entities.Role;
import com.roadsentinel.roadsentinel_backend_api.repositories.RoleRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {

            if (roleRepository.findByName("ROLE_USER").isEmpty()) {

                roleRepository.save(Role.builder().name("ROLE_USER").build());
                roleRepository.save(Role.builder().name("ROLE_OFFICER").build());
                roleRepository.save(Role.builder().name("ROLE_PRODUCT_ADMIN").build());

                System.out.println("✅ Roles initialized");
            }
        };
    }
}