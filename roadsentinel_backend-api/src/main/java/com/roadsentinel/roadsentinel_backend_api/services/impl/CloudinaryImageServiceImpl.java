package com.roadsentinel.roadsentinel_backend_api.services.impl;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.roadsentinel.roadsentinel_backend_api.services.CloudinaryImageService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CloudinaryImageServiceImpl implements CloudinaryImageService {

    private final Cloudinary cloudinary;

    @Override
    public Map upload(MultipartFile multipartFile) {
        if (multipartFile == null || multipartFile.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty or null file");
        }

        try {
            Map options = ObjectUtils.asMap(
                "resource_type", "auto",
                "folder", "roadsentinel_complaints" // Optional: organizes uploads into a specific folder in Cloudinary
            );

            Map data = this.cloudinary.uploader().upload(multipartFile.getBytes(), options);
            return data;

        } catch (IOException e) {
            throw new RuntimeException("Image uploading failed: " + e.getMessage(), e);
        }
    }
}