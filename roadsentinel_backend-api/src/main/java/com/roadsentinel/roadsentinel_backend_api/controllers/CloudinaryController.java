package com.roadsentinel.roadsentinel_backend_api.controllers;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.roadsentinel.roadsentinel_backend_api.services.CloudinaryImageService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/upload")
@AllArgsConstructor
public class CloudinaryController {
    
    private final CloudinaryImageService cloudinaryImageService;

    @PostMapping("/imageUpload")
    public ResponseEntity<Map> uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        Map data = this.cloudinaryImageService.upload(file);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
