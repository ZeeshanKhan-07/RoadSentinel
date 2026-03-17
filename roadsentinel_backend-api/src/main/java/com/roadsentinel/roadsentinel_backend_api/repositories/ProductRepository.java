package com.roadsentinel.roadsentinel_backend_api.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.roadsentinel.roadsentinel_backend_api.entities.Products;

@Repository
public interface ProductRepository extends JpaRepository<Products, UUID>{
    
}
