package com.roadsentinel.roadsentinel_backend_api.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.roadsentinel.roadsentinel_backend_api.entities.Orders;

@Repository
public interface OrderRepository extends JpaRepository<Orders, UUID> {

    @Query("SELECT SUM(o.totalAmount) FROM Orders o WHERE o.user.id = :userId")
    Long sumTotalAmountByUserId(@Param("userId") UUID userId);
}
