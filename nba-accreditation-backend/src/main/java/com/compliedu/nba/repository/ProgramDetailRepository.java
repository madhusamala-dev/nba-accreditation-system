package com.compliedu.nba.repository;

import com.compliedu.nba.entity.ProgramDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramDetailRepository extends JpaRepository<ProgramDetail, Long> {
    List<ProgramDetail> findByPreQualifierIdOrderBySortOrderAsc(Long preQualifierId);
}