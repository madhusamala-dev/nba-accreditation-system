package com.compliedu.nba.repository;

import com.compliedu.nba.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:userId IS NULL OR a.user.id = :userId) AND " +
           "(:entityType IS NULL OR a.entityType = :entityType) AND " +
           "(:action IS NULL OR a.action = :action)")
    Page<AuditLog> findAllWithFilters(@Param("userId") Long userId,
                                      @Param("entityType") String entityType,
                                      @Param("action") String action,
                                      Pageable pageable);
}