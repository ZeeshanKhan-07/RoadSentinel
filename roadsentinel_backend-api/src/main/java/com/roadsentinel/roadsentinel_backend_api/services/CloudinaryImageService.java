package com.roadsentinel.roadsentinel_backend_api.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryImageService {
    public Map upload(MultipartFile multipartFile) throws IOException;
}
