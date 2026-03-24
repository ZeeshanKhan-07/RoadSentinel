package com.roadsentinel.roadsentinel_backend_api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.roadsentinel.roadsentinel_backend_api.dtos.ProductRequestDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductResponseDTO;
import com.roadsentinel.roadsentinel_backend_api.services.ProductService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/addProduct")
    public ResponseEntity<ProductResponseDTO> addProduct(
            @ModelAttribute ProductRequestDTO productRequestDTO) {

        return ResponseEntity.ok(productService.addProduct(productRequestDTO));
    }

    @GetMapping("/allProducts")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable UUID id,
            @ModelAttribute ProductRequestDTO productRequestDTO) {

        return ResponseEntity.ok(productService.updateProduct(id, productRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable UUID id) {

        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}