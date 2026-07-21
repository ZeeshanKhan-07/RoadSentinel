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

    @Bean
    public Cloudinary cloudinary() {
        Map config = new HashMap();
        config.put("cloud_name", "dpiqehal0");
        config.put("api_key", "691275199849529");
        config.put("api_secret", "u1fYKz2TGjP_3bWh_FluLCPMe5w");
        config.put("secure", true);

        return new Cloudinary(config);
    }

    
}