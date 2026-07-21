package com.roadsentinel.roadsentinel_backend_api.controllers.Officer;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintDTO;
import com.roadsentinel.roadsentinel_backend_api.enums.Status;
import com.roadsentinel.roadsentinel_backend_api.services.ComplaintService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/admin/officer")
@AllArgsConstructor
public class ChallanController {
    
    private final ComplaintService complaintService;

    @PatchMapping("/{complaintId}/status")
    public ResponseEntity<ComplaintDTO> updateComplaintStatus(
            @PathVariable UUID complaintId,
            @RequestParam Status status) {
        
        ComplaintDTO updatedComplaint = complaintService.updateComplaintStatus(complaintId, status);
        return ResponseEntity.ok(updatedComplaint);
    }

    @PatchMapping("/{complaintId}/reward")
    public ResponseEntity<ComplaintDTO> assignReward(
            @PathVariable UUID complaintId,
            @RequestParam Integer rewardAmount) {
        
        ComplaintDTO updatedComplaint = complaintService.assignReward(complaintId, rewardAmount);
        return ResponseEntity.ok(updatedComplaint);
    }

    
}
