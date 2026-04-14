package com.compliedu.nba.repository;

import com.compliedu.nba.entity.FacultyCadreRow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyCadreRowRepository extends JpaRepository<FacultyCadreRow, Long> {
    List<FacultyCadreRow> findByPreQualifierIdOrderBySortOrderAsc(Long preQualifierId);
}