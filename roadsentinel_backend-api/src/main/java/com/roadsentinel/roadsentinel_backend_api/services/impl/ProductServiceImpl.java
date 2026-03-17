package com.roadsentinel.roadsentinel_backend_api.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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

    @Override
    public ProductResponseDTO addProduct(ProductRequestDTO productRequestDTO) {

        Products product = new Products();

        product.setName(productRequestDTO.getName());
        product.setDescription(productRequestDTO.getDescription());
        product.setQuantity(productRequestDTO.getQuantity());
        product.setPrice(productRequestDTO.getPrice());

        List<ProductImage> imageList = new ArrayList<>();

        if (productRequestDTO.getImages() != null) {

            for (MultipartFile file : productRequestDTO.getImages()) {

                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

                Path uploadPath = Paths.get("uploads", "productImages");

                try {

                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }

                    Path filePath = uploadPath.resolve(fileName);

                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                } catch (IOException e) {
                    throw new RuntimeException("Image upload failed");
                }

                ProductImage image = new ProductImage();
                image.setImageUrl("/uploads/productImages" + fileName);
                image.setProduct(product);

                imageList.add(image);
            }
        }

        product.setImages(imageList);

        Products savedProduct = productRepository.save(product);

        ProductResponseDTO response = new ProductResponseDTO();

        response.setId(savedProduct.getId().toString());
        response.setName(savedProduct.getName());
        response.setDescription(savedProduct.getDescription());
        response.setQuantity(savedProduct.getQuantity());
        response.setPrice(savedProduct.getPrice());

        List<String> imageUrls = savedProduct.getImages()
                .stream()
                .map(ProductImage::getImageUrl)
                .toList();

        response.setImages(imageUrls);

        return response;
    }

    @Override
    public void deleteProduct(UUID id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteProduct'");
    }

}
