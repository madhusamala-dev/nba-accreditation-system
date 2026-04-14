package com.compliedu.nba.repository;

import com.compliedu.nba.entity.PreQualifier;
import com.compliedu.nba.entity.enums.PreQualifierStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PreQualifierRepository extends JpaRepository<PreQualifier, Long> {

    List<PreQualifier> findByInstitutionId(Long institutionId);

    Optional<PreQualifier> findFirstByInstitutionIdOrderByCreatedAtDesc(Long institutionId);

    @Query("SELECT pq FROM PreQualifier pq WHERE " +
           "(:status IS NULL OR pq.status = :status) AND " +
           "(:institutionId IS NULL OR pq.institution.id = :institutionId)")
    Page<PreQualifier> findAllWithFilters(@Param("status") PreQualifierStatus status,
                                          @Param("institutionId") Long institutionId,
                                          Pageable pageable);

    long countByStatus(PreQualifierStatus status);
}