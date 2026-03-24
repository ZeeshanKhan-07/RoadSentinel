package com.roadsentinel.roadsentinel_backend_api.entities;

import java.util.List;
import java.util.UUID;

import com.roadsentinel.roadsentinel_backend_api.enums.ProductGenderCategory;
import com.roadsentinel.roadsentinel_backend_api.enums.ProductVehicleCategory;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String description;

    private int quantity;

    @Enumerated(EnumType.STRING)
    private ProductVehicleCategory productVehicleCategory;

    @Enumerated(EnumType.STRING)
    private ProductGenderCategory productGenderCategory;

    private long price;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductImage> images;
}
