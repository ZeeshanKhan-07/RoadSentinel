package com.roadsentinel.roadsentinel_backend_api.services.impl;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.roadsentinel.roadsentinel_backend_api.services.CloudinaryImageService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CloudinaryImageServiceImpl implements CloudinaryImageService {

    private final Cloudinary cloudinary;

    @Override
    public Map upload(MultipartFile multipartFile) {
        try {
            Map data = this.cloudinary.uploader().upload(multipartFile.getBytes(), Map.of());
            return data;
        } catch (IOException e) {
            throw new RuntimeException("Image uploading fail..." + e);
        }
    }

}
