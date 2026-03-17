package com.roadsentinel.roadsentinel_backend_api.dtos;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.roadsentinel.roadsentinel_backend_api.enums.Status;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintDTO {

    private UUID id;

    private UUID userId;

    private Instant raisedAt = Instant.now();

    private Instant updatedAt;

    private String address;

    private String city;

    private String state;

    private Double latitude;

    private Double longitude;

    private String vehicleNumber;

    private String vehicleType;

    private String violationType;

    private String description;

    private Integer rewardAmount;

    private List<AttachmentDTO> attachments;

    private Status status = Status.PENDING;
}
