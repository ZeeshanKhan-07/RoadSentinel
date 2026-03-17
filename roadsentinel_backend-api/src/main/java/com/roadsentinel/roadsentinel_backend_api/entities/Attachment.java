package com.roadsentinel.roadsentinel_backend_api.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String fileUrl;  // S3 link or local path
    private String fileType; // e.g., "image/jpeg" or "video/mp4"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complain_id")
    private Complaint complain; // Back-reference to the parent complaint
    
}