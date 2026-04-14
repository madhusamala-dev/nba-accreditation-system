package com.compliedu.nba.repository;

import com.compliedu.nba.entity.SfrData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SfrDataRepository extends JpaRepository<SfrData, Long> {
    Optional<SfrData> findByPreQualifierId(Long preQualifierId);
}