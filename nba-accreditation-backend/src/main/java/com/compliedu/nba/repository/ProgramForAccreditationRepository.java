package com.compliedu.nba.repository;

import com.compliedu.nba.entity.ProgramForAccreditation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramForAccreditationRepository extends JpaRepository<ProgramForAccreditation, Long> {
    List<ProgramForAccreditation> findByPreQualifierIdOrderBySortOrderAsc(Long preQualifierId);
}