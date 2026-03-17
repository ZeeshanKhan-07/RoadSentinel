package com.roadsentinel.roadsentinel_backend_api.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.roadsentinel.roadsentinel_backend_api.entities.Complaint;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {

    List<Complaint> findByUserId(UUID userId);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.user.id = :userId")
    long countByUserId(@Param("userId") UUID userId);
}
