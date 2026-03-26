package com.roadsentinel.roadsentinel_backend_api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintDTO;
import com.roadsentinel.roadsentinel_backend_api.services.ComplaintService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/complaint")
@AllArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping(value = "/register", consumes = { "multipart/form-data" })
    public ResponseEntity<ComplaintDTO> raiseComplaint(
            @ModelAttribute ComplaintDTO complaintDTO,
            @RequestParam("media") List<MultipartFile> files) {

        ComplaintDTO savedComplaint = complaintService.registerComplain(complaintDTO, files);

        return ResponseEntity.ok(savedComplaint);
    }

    @GetMapping("/{userId}/complaints")
    public ResponseEntity<List<ComplaintDTO>> getUserComplaints(@PathVariable UUID userId) {
        List<ComplaintDTO> complaints = complaintService.getComplaintByUserId(userId);
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/{userId}/totalComplaints")
    public ResponseEntity<Long> getTotalComplaints(@PathVariable UUID userId) {
        long ans = complaintService.getTotalComplaints(userId);
        return ResponseEntity.ok(ans);
    }

    @GetMapping("/{userId}/successedComplaints")
    public ResponseEntity<Long> getTotalSuccessComplaints(@PathVariable UUID userId) {
        long successed = complaintService.getTotalSuccessedComplaints(userId);
        return ResponseEntity.ok(successed);
    }
}