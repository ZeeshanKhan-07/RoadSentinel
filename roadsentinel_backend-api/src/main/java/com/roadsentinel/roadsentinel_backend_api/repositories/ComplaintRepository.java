package com.roadsentinel.roadsentinel_backend_api.repositories;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.roadsentinel.roadsentinel_backend_api.entities.Complaint;
import com.roadsentinel.roadsentinel_backend_api.enums.Status;
import com.roadsentinel.roadsentinel_backend_api.repositories.projections.CityCountProjection;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {

    List<Complaint> findByUserId(UUID userId);

    @Query("SELECT COALESCE(SUM(c.rewardAmount), 0) FROM Complaint c WHERE LOWER(c.user.email) = LOWER(:email) AND c.status = com.roadsentinel.roadsentinel_backend_api.enums.Status.APPROVED")
    Long sumRewardAmountByUserEmail(@Param("email") String email);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.user.id = :userId")
    long countByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.user.id = :userId AND c.rewardAmount > 1")
    long countByUserIdAndRewardAmountGreaterThanOne(@Param("userId") UUID userId);

    long countByStatus(Status status);

    @Query("SELECT COALESCE(SUM(c.rewardAmount), 0) FROM Complaint c")
    long sumTotalRewardsIssued();

    long countByRaisedAtAfter(Instant startInstant);

    @Query("SELECT c.city AS city, COUNT(c) AS count FROM Complaint c WHERE c.city IS NOT NULL GROUP BY c.city ORDER BY COUNT(c) DESC")
    List<CityCountProjection> countComplaintsByCity();

    List<Complaint> findByOrderByRaisedAtDesc(Pageable pageable);
}
