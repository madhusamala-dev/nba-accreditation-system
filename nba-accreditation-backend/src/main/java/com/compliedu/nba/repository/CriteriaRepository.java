package com.compliedu.nba.repository;

import com.compliedu.nba.entity.Criteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CriteriaRepository extends JpaRepository<Criteria, Long> {

    List<Criteria> findBySarApplicationIdOrderByCriteriaNumberAsc(Long sarApplicationId);

    Optional<Criteria> findBySarApplicationIdAndId(Long sarApplicationId, Long criteriaId);
}