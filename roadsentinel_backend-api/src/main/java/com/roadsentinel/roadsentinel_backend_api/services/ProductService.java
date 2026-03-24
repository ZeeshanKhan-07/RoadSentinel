package com.roadsentinel.roadsentinel_backend_api.services;

import java.util.List;
import java.util.UUID;

import com.roadsentinel.roadsentinel_backend_api.dtos.ProductRequestDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductResponseDTO;

public interface ProductService {
    ProductResponseDTO addProduct(ProductRequestDTO productRequestDTO);
    List<ProductResponseDTO> getAllProducts();
    ProductResponseDTO updateProduct(UUID id, ProductRequestDTO productRequestDTO);
    void deleteProduct(UUID id);
}
