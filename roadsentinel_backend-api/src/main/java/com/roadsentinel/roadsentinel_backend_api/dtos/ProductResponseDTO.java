package com.roadsentinel.roadsentinel_backend_api.dtos;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductResponseDTO {

    private String id;
    private String name;
    private String description;
    private int quantity;
    private long price;
    private List<String> images;

}
