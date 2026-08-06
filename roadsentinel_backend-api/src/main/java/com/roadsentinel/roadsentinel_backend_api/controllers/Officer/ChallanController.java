package com.roadsentinel.roadsentinel_backend_api.controllers.Officer;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.CityCountDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.ComplaintsStatusCountDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.DashboardSummaryDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.StatusDistributionDTO;
import com.roadsentinel.roadsentinel_backend_api.dtos.ComplaintsOfficer.UserInfoDTO;
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

    // list of total complaints

    // count of total complaints

    // count pending verifications, approved conplaints, under review complaints and
    // rejected complaints

    // Total reward issue --> count total rewards from the users table

    // Todays coplaints --> count the issue date > Instand.now() (somplaints after
    // todays 12 am)

    // count of this months complaints

    // FOR CHARTS

    // Doughnot Chart = Complaints status distributions --> Pending = 40%, Approved
    // = 20%, Rejected = 15%, Under Review = 25%

    // Bar Chart = Complaints by city --> Delhi = 32, Bihar = 45, Jharkhand = 10 etc

    // Recent Complaints --> list of 5 recent complaints

    // --- NEW ANALYTICS & DASHBOARD ENDPOINTS ---

    // 1. Get ALL complaints in system
    @GetMapping("/all")
    public ResponseEntity<List<ComplaintDTO>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    // 2. Complete Dashboard Consolidated Metrics (Recommended for Frontend
    // Dashboards)
    @GetMapping("/admin/dashboard-summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary() {
        return ResponseEntity.ok(complaintService.getDashboardSummary());
    }

    // 3. Status breakdown counts (Pending, Under Review, Approved, Rejected)
    @GetMapping("/analytics/status-counts")
    public ResponseEntity<ComplaintsStatusCountDTO> getStatusCounts() {
        return ResponseEntity.ok(complaintService.getStatusCounts());
    }

    // 4. Status distribution percentages for Doughnut Chart
    @GetMapping("/analytics/status-distribution")
    public ResponseEntity<StatusDistributionDTO> getStatusDistribution() {
        return ResponseEntity.ok(complaintService.getStatusDistribution());
    }

    // 5. City breakdown for Bar Chart
    @GetMapping("/analytics/by-city")
    public ResponseEntity<List<CityCountDTO>> getComplaintsByCity() {
        return ResponseEntity.ok(complaintService.getComplaintsByCity());
    }

    // 6. Top N Recent Complaints (default = 5)
    @GetMapping("/recent")
    public ResponseEntity<List<ComplaintDTO>> getRecentComplaints(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(complaintService.getRecentComplaints(limit));
    }

    @GetMapping("/{complaintId}/user")
    public ResponseEntity<UserInfoDTO> getUserByComplaintId(@PathVariable UUID complaintId) {
        UserInfoDTO userDTO = complaintService.getUserByComplaintId(complaintId);
        return ResponseEntity.ok(userDTO);
    }

}
