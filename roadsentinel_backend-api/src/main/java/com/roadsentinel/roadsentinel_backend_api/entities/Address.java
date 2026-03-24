package com.roadsentinel.roadsentinel_backend_api.entities;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String phone;
    private String houseNo;
    private String street;
    private String locality;
    private String landmark;
    private String city;
    private String state;
    private String pincode;
    private String country;
}
