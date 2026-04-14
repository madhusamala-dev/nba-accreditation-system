package com.compliedu.nba.repository;

import com.compliedu.nba.entity.ComplianceRow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplianceRowRepository extends JpaRepository<ComplianceRow, Long> {
    List<ComplianceRow> findByPreQualifierIdOrderBySortOrderAsc(Long preQualifierId);
}