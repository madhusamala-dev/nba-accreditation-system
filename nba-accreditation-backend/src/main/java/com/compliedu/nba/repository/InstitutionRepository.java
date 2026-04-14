package com.compliedu.nba.repository;

import com.compliedu.nba.entity.Institution;
import com.compliedu.nba.entity.enums.AccreditationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {

    @Query("SELECT i FROM Institution i WHERE " +
           "(:status IS NULL OR i.accreditationStatus = :status) AND " +
           "(:search IS NULL OR LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(i.city) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(i.state) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Institution> findAllWithFilters(@Param("status") AccreditationStatus status,
                                         @Param("search") String search,
                                         Pageable pageable);
}