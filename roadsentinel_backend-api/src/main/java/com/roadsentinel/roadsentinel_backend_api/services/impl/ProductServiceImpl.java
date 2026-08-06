package com.roadsentinel.roadsentinel_backend_api.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.roadsentinel.roadsentinel_backend_api.dtos.OrderStatus;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductBarChartDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductDashboardMetricsDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductRequestDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductResponseDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderStatusMetricDTO;
import com.roadsentinel.roadsentinel_backend_api.entities.ProductImage;
import com.roadsentinel.roadsentinel_backend_api.entities.Products;
import com.roadsentinel.roadsentinel_backend_api.repositories.ProductRepository;
import com.roadsentinel.roadsentinel_backend_api.services.CloudinaryImageService;
import com.roadsentinel.roadsentinel_backend_api.services.ProductService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final Cloudinary cloudinary;
    private final CloudinaryImageService cloudinaryImageService;

    @Override
    public ProductResponseDTO addProduct(ProductRequestDTO productRequestDTO) {

        Products product = modelMapper.map(productRequestDTO, Products.class);

        product.setImages(new ArrayList<>());

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
    @Transactional
    public ProductResponseDTO updateProduct(UUID id, ProductRequestDTO productRequestDTO) {

        Products product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 1. Partial updates for text & number fields (Only update if provided)
        if (productRequestDTO.getName() != null && !productRequestDTO.getName().isBlank()) {
            product.setName(productRequestDTO.getName());
        }

        if (productRequestDTO.getDescription() != null && !productRequestDTO.getDescription().isBlank()) {
            product.setDescription(productRequestDTO.getDescription());
        }

        if (productRequestDTO.getQuantity() > 0) {
            product.setQuantity(productRequestDTO.getQuantity());
        }

        if (productRequestDTO.getPrice() > 0) {
            product.setPrice(productRequestDTO.getPrice());
        }

        // 2. Partial updates for Enums
        if (productRequestDTO.getProductVehicleCategory() != null
                && !productRequestDTO.getProductVehicleCategory().isBlank()) {
            product.setProductVehicleCategory(
                    com.roadsentinel.roadsentinel_backend_api.enums.ProductVehicleCategory.valueOf(
                            productRequestDTO.getProductVehicleCategory().toUpperCase()));
        }

        if (productRequestDTO.getProductGenderCategory() != null
                && !productRequestDTO.getProductGenderCategory().isBlank()) {
            product.setProductGenderCategory(
                    com.roadsentinel.roadsentinel_backend_api.enums.ProductGenderCategory.valueOf(
                            productRequestDTO.getProductGenderCategory().toUpperCase()));
        }

        // 3. ONLY update/clear images if NEW image files are uploaded
        if (productRequestDTO.getImages() != null && !productRequestDTO.getImages().isEmpty()) {

            // Delete old images
            deleteImagesFromStorage(product);

            // Clear old image list
            product.getImages().clear();

            // Save new images
            List<ProductImage> newImages = saveImages(productRequestDTO.getImages(), product);
            product.getImages().addAll(newImages);
        }

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

        for (MultipartFile file : files) {
            try {
                Map uploadResult = cloudinaryImageService.upload(file);
                String imageUrl = (String) uploadResult.get("secure_url");
                String publicId = (String) uploadResult.get("public_id");

                ProductImage image = new ProductImage();
                image.setImageUrl(imageUrl);
                image.setProduct(product);
                image.setPublicId(publicId);
                imageList.add(image);
            } catch (Exception e) {
                throw new RuntimeException("Cloudinary upload failed for one or more files... " + e.getMessage());
            }
        }
        return imageList;
    }

    private void deleteImagesFromStorage(Products product) {
        if (product.getImages() == null)
            return;

        for (ProductImage img : product.getImages()) {
            try {
                // Delete image from Cloudinary using its public_id
                if (img.getPublicId() != null && !img.getPublicId().isBlank()) {
                    cloudinary.uploader().destroy(img.getPublicId(), Map.of());
                }
            } catch (Exception e) {
                System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
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

    @Override
    public ProductDashboardMetricsDTO getDashboardMetrics() {
        long totalUnique = productRepository.countUniqueProducts();

        long soldCount = productRepository.countProductsByOrderStatus(OrderStatus.DELIVERED);

        long toBeDeliveredCount = productRepository.countProductsByOrderStatus(OrderStatus.CONFIRMED);

        return new ProductDashboardMetricsDTO(totalUnique, soldCount, toBeDeliveredCount);
    }

    @Override
    public List<ProductBarChartDTO> getProductsForBarChart() {
        return productRepository.fetchBarChartMetrics();
    }

    @Override
    public List<OrderStatusMetricDTO> getOrderStatusForCircularChart() {
        return productRepository.fetchOrderStatusMetrics();
    }
}