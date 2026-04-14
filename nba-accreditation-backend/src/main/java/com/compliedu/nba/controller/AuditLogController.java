package com.compliedu.nba.controller;

import com.compliedu.nba.dto.response.AuditLogResponse;
import com.compliedu.nba.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Page<AuditLogResponse>> listAuditLogs(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String action,
            Pageable pageable) {
        return ResponseEntity.ok(auditLogService.listAuditLogs(userId, entityType, action, pageable));
    }
}