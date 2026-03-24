package com.roadsentinel.roadsentinel_backend_api.dtos.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponse {

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
