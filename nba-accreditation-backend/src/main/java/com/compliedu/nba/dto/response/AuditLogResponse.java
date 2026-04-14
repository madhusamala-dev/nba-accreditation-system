package com.compliedu.nba.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AuditLogResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private String action;
    private String entityType;
    private Long entityId;
    private Map<String, Object> oldValue;
    private Map<String, Object> newValue;
    private String ipAddress;
    private LocalDateTime createdAt;
}