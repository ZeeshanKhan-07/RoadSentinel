package com.roadsentinel.roadsentinel_backend_api.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.roadsentinel.roadsentinel_backend_api.entities.Orders;

@Repository
public interface OrderRepository extends JpaRepository<Orders, UUID> {

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Orders o WHERE o.user.email = :email")
    Long sumTotalAmountByUserEmail(@Param("email") String email);
}
