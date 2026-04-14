package com.compliedu.nba.repository;

import com.compliedu.nba.entity.SfrProgramRow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SfrProgramRowRepository extends JpaRepository<SfrProgramRow, Long> {
    List<SfrProgramRow> findBySfrDataIdOrderBySortOrderAsc(Long sfrDataId);
}