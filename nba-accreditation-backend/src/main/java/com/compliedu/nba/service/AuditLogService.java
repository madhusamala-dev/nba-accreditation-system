package com.compliedu.nba.service;

import com.compliedu.nba.dto.response.AuditLogResponse;
import com.compliedu.nba.entity.AuditLog;
import com.compliedu.nba.entity.User;
import com.compliedu.nba.repository.AuditLogRepository;
import com.compliedu.nba.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public Page<AuditLogResponse> listAuditLogs(Long userId, String entityType, String action, Pageable pageable) {
        return auditLogRepository.findAllWithFilters(userId, entityType, action, pageable)
                .map(this::mapToResponse);
    }

    public void log(String email, String action, String entityType, Long entityId) {
        User user = userRepository.findByEmail(email).orElse(null);
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .build();
        auditLogRepository.save(auditLog);
    }

    private AuditLogResponse mapToResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .userId(log.getUser() != null ? log.getUser().getId() : null)
                .userEmail(log.getUser() != null ? log.getUser().getEmail() : null)
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .ipAddress(log.getIpAddress())
                .createdAt(log.getCreatedAt())
                .build();
    }
}