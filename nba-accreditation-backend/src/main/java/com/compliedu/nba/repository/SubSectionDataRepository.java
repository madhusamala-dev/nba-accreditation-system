package com.compliedu.nba.repository;

import com.compliedu.nba.entity.SubSectionData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubSectionDataRepository extends JpaRepository<SubSectionData, Long> {

    Optional<SubSectionData> findBySectionIdAndId(Long sectionId, Long subSectionId);
}