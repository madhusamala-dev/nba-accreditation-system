package com.compliedu.nba.repository;

import com.compliedu.nba.entity.SectionData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SectionDataRepository extends JpaRepository<SectionData, Long> {

    List<SectionData> findByCriteriaIdOrderBySectionNumberAsc(Long criteriaId);

    Optional<SectionData> findByCriteriaIdAndId(Long criteriaId, Long sectionId);
}