package com.compliedu.nba.repository;

import com.compliedu.nba.entity.EmailNotification;
import com.compliedu.nba.entity.enums.NotificationStatus;
import com.compliedu.nba.entity.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailNotificationRepository extends JpaRepository<EmailNotification, Long> {

    List<EmailNotification> findByStatusAndRetryCountLessThan(NotificationStatus status, Integer maxRetries);

    @Query("SELECT n FROM EmailNotification n WHERE " +
           "(:status IS NULL OR n.status = :status) AND " +
           "(:type IS NULL OR n.notificationType = :type)")
    Page<EmailNotification> findAllWithFilters(@Param("status") NotificationStatus status,
                                               @Param("type") NotificationType type,
                                               Pageable pageable);

    long countByStatus(NotificationStatus status);
}