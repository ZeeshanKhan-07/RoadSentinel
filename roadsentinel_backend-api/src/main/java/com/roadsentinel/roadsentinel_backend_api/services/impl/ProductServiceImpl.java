package com.roadsentinel.roadsentinel_backend_api.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.roadsentinel.roadsentinel_backend_api.dtos.ProductRequestDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductResponseDTO;
import com.roadsentinel.roadsentinel_backend_api.entities.ProductImage;
import com.roadsentinel.roadsentinel_backend_api.entities.Products;
import com.roadsentinel.roadsentinel_backend_api.repositories.ProductRepository;
import com.roadsentinel.roadsentinel_backend_api.services.ProductService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public ProductResponseDTO addProduct(ProductRequestDTO productRequestDTO) {

        Products product = modelMapper.map(productRequestDTO, Products.class);

        List<ProductImage> imageList = saveImages(productRequestDTO.getImages(), product);

        product.setImages(imageList);

        Products savedProduct = productRepository.save(product);

        return mapToResponseDTO(savedProduct);
    }

    @Override
    public List<ProductResponseDTO> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    public ProductResponseDTO updateProduct(UUID id, ProductRequestDTO productRequestDTO) {

        Products product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        modelMapper.map(productRequestDTO, product);

        deleteImagesFromStorage(product);

        product.getImages().clear();

        List<ProductImage> newImages = saveImages(productRequestDTO.getImages(), product);

        product.setImages(newImages);

        Products updatedProduct = productRepository.save(product);

        return mapToResponseDTO(updatedProduct);
    }

    @Override
    public void deleteProduct(UUID id) {

        Products product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        deleteImagesFromStorage(product);

        productRepository.delete(product);
    }

    private List<ProductImage> saveImages(List<MultipartFile> files, Products product) {

        List<ProductImage> imageList = new ArrayList<>();

        if (files == null)
            return imageList;

        Path uploadPath = Paths.get("uploads", "productImages");

        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory");
        }

        for (MultipartFile file : files) {

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            try {
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new RuntimeException("Image upload failed");
            }

            ProductImage image = new ProductImage();
            image.setImageUrl("/uploads/productImages/" + fileName);
            image.setProduct(product);

            imageList.add(image);
        }

        return imageList;
    }

    private void deleteImagesFromStorage(Products product) {

        if (product.getImages() == null)
            return;

        for (ProductImage img : product.getImages()) {
            try {
                String fileName = img.getImageUrl()
                        .replace("/uploads/productImages/", "");

                Path path = Paths.get("uploads", "productImages", fileName);

                Files.deleteIfExists(path);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private ProductResponseDTO mapToResponseDTO(Products product) {

        ProductResponseDTO response = modelMapper.map(product, ProductResponseDTO.class);

        List<String> imageUrls = product.getImages()
                .stream()
                .map(ProductImage::getImageUrl)
                .toList();

        response.setImages(imageUrls);

        return response;
    }
}