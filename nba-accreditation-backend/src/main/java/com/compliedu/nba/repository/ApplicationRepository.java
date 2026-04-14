package com.compliedu.nba.repository;

import com.compliedu.nba.entity.Application;
import com.compliedu.nba.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByInstitutionId(Long institutionId);

    Page<Application> findByStatus(ApplicationStatus status, Pageable pageable);
}