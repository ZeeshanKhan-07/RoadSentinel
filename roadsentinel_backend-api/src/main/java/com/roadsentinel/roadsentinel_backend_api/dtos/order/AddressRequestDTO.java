package com.roadsentinel.roadsentinel_backend_api.dtos.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequestDTO {

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