package com.compliedu.nba.repository;

import com.compliedu.nba.entity.AlliedDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlliedDepartmentRepository extends JpaRepository<AlliedDepartment, Long> {
    List<AlliedDepartment> findByPreQualifierIdOrderBySortOrderAsc(Long preQualifierId);
}