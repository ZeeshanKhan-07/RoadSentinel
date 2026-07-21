package com.roadsentinel.roadsentinel_backend_api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.roadsentinel.roadsentinel_backend_api.dtos.ProductResponseDTO;
import com.roadsentinel.roadsentinel_backend_api.services.ProductService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/allProducts")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

}