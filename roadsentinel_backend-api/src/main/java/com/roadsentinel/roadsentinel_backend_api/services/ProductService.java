package com.roadsentinel.roadsentinel_backend_api.services;

import java.util.List;
import java.util.UUID;

import com.roadsentinel.roadsentinel_backend_api.dtos.ProductBarChartDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductDashboardMetricsDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductRequestDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductResponseDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderStatusMetricDTO;

public interface ProductService {
    ProductResponseDTO addProduct(ProductRequestDTO productRequestDTO);
    List<ProductResponseDTO> getAllProducts();
    ProductResponseDTO updateProduct(UUID id, ProductRequestDTO productRequestDTO);
    ProductDashboardMetricsDTO getDashboardMetrics();
    List<ProductBarChartDTO> getProductsForBarChart();
    List<OrderStatusMetricDTO> getOrderStatusForCircularChart();
    void deleteProduct(UUID id);
}
