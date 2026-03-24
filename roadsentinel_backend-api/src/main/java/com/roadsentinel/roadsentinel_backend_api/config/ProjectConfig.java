package com.roadsentinel.roadsentinel_backend_api.config;

import java.util.HashMap;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class ProjectConfig {
    
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    
}