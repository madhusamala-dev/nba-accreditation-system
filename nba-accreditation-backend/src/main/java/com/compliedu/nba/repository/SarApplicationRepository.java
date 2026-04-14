package com.compliedu.nba.repository;

import com.compliedu.nba.entity.SarApplication;
import com.compliedu.nba.entity.enums.SarStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SarApplicationRepository extends JpaRepository<SarApplication, Long> {

    List<SarApplication> findByInstitutionId(Long institutionId);

    @Query("SELECT sa FROM SarApplication sa WHERE " +
           "(:status IS NULL OR sa.status = :status) AND " +
           "(:institutionId IS NULL OR sa.institution.id = :institutionId) AND " +
           "(:departmentName IS NULL OR LOWER(sa.departmentName) LIKE LOWER(CONCAT('%', :departmentName, '%')))")
    Page<SarApplication> findAllWithFilters(@Param("status") SarStatus status,
                                            @Param("institutionId") Long institutionId,
                                            @Param("departmentName") String departmentName,
                                            Pageable pageable);

    long countByStatus(SarStatus status);

    @Query("SELECT COUNT(sa) FROM SarApplication sa WHERE sa.institution.id = :institutionId")
    long countByInstitutionId(@Param("institutionId") Long institutionId);
}