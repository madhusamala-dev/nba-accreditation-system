package com.compliedu.nba.repository;

import com.compliedu.nba.entity.FacultyRow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyRowRepository extends JpaRepository<FacultyRow, Long> {
    List<FacultyRow> findByPreQualifierIdOrderBySortOrderAsc(Long preQualifierId);
}