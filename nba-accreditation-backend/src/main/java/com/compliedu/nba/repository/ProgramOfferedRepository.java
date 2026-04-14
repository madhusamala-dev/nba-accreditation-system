package com.compliedu.nba.repository;

import com.compliedu.nba.entity.ProgramOffered;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramOfferedRepository extends JpaRepository<ProgramOffered, Long> {
    List<ProgramOffered> findByPreQualifierIdOrderBySortOrderAsc(Long preQualifierId);
}