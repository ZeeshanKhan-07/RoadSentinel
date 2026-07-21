package com.roadsentinel.roadsentinel_backend_api.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.roadsentinel.roadsentinel_backend_api.dtos.OrderStatus;
import com.roadsentinel.roadsentinel_backend_api.dtos.ProductBarChartDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderStatusMetricDTO;
import com.roadsentinel.roadsentinel_backend_api.entities.Products;

@Repository
public interface ProductRepository extends JpaRepository<Products, UUID>{
    
    @Query("SELECT COUNT(p) FROM Products p")
    long countUniqueProducts();

    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi WHERE oi.order.status = :status")
    long countProductsByOrderStatus(@Param("status") OrderStatus status);

    @Query("SELECT new com.roadsentinel.roadsentinel_backend_api.dtos.ProductBarChartDTO(p.id, p.name, p.quantity) FROM Products p")
    List<ProductBarChartDTO> fetchBarChartMetrics();

    @Query("SELECT new com.roadsentinel.roadsentinel_backend_api.dtos.order.OrderStatusMetricDTO(o.status, COUNT(o)) FROM Orders o GROUP BY o.status")
    List<OrderStatusMetricDTO> fetchOrderStatusMetrics();
}
