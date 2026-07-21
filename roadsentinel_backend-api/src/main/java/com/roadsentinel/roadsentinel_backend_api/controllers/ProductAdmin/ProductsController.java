package com.roadsentinel.roadsentinel_backend_api.controllers.ProductAdmin;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.roadsentinel.roadsentinel_backend_api.dtos.OrderStatus;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductBarChartDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductDashboardMetricsDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductRequestDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductResponseDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderStatusMetricDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderStatusUpdateResponseDTO;
import com.roadsentinel.roadsentinel_backend_api.services.OrderService;
import com.roadsentinel.roadsentinel_backend_api.services.ProductService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/admin/product")
@AllArgsConstructor
public class ProductsController {

    private final ProductService productService;
    private final OrderService orderService;

    // add prduct
    @PreAuthorize("hasRole('PRODUCT_ADMIN')")
    @PostMapping("/addProduct")
    public ResponseEntity<ProductResponseDTO> addProduct(
            @ModelAttribute ProductRequestDTO productRequestDTO) {

        return ResponseEntity.ok(productService.addProduct(productRequestDTO));
    }

    // edit product details
    @PreAuthorize("hasRole('PRODUCT_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable UUID id,
            @ModelAttribute ProductRequestDTO productRequestDTO) {

        return ResponseEntity.ok(productService.updateProduct(id, productRequestDTO));
    }

    // delete product
    @PreAuthorize("hasRole('PRODUCT_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable UUID id) {

        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    // FOR ORDERS

    // Total products count --> Count all the prods that we have
    @PreAuthorize("hasRole('PRODUCT_ADMIN')")
    @GetMapping("/dashboard-metrics")
    public ResponseEntity<ProductDashboardMetricsDTO> getDashboardMetrics() {
        return ResponseEntity.ok(productService.getDashboardMetrics());
    }

    @PreAuthorize("hasRole('PRODUCT_ADMIN')")
    @GetMapping("/charts/bar-metrics")
    public ResponseEntity<List<ProductBarChartDTO>> getBarChartMetrics() {
        return ResponseEntity.ok(productService.getProductsForBarChart());
    }

    @PreAuthorize("hasRole('PRODUCT_ADMIN')")
    @GetMapping("/charts/circular-metrics")
    public ResponseEntity<List<OrderStatusMetricDTO>> getCircularChartMetrics() {
        return ResponseEntity.ok(productService.getOrderStatusForCircularChart());
    }

    // Update order status (CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
    @PreAuthorize("hasRole('PRODUCT_ADMIN')")
    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderStatusUpdateResponseDTO> updateOrderStatus(
            @PathVariable UUID id,
            @RequestParam OrderStatus status) {

        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // Return request --. Iterate through the return request table and check the
    // status as RETURN_REQUEST_SUBMITTED

}
