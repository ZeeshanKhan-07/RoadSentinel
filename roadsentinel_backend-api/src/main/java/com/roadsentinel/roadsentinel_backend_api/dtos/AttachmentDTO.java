package com.roadsentinel.roadsentinel_backend_api.dtos;

import java.util.UUID;
import lombok.Data;

@Data
public class AttachmentDTO {
    private UUID id;
    private String fileUrl;
    private String fileType;
}