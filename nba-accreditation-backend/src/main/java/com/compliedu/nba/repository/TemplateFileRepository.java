package com.compliedu.nba.repository;

import com.compliedu.nba.entity.TemplateFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TemplateFileRepository extends JpaRepository<TemplateFile, Long> {
}