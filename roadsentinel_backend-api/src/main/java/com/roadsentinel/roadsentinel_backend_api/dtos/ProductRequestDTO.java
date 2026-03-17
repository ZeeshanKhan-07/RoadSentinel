package com.roadsentinel.roadsentinel_backend_api.dtos;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequestDTO {

    private String name;
    private String description;
    private int quantity;
    private long price;

    private List<MultipartFile> images;

}
