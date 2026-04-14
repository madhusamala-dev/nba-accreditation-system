package com.compliedu.nba.controller;

import com.compliedu.nba.dto.request.SendNotificationRequest;
import com.compliedu.nba.dto.response.MessageResponse;
import com.compliedu.nba.dto.response.NotificationResponse;
import com.compliedu.nba.entity.enums.NotificationStatus;
import com.compliedu.nba.entity.enums.NotificationType;
import com.compliedu.nba.service.EmailNotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class NotificationController {

    private final EmailNotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> listNotifications(
            @RequestParam(required = false) NotificationStatus status,
            @RequestParam(required = false) NotificationType type,
            Pageable pageable) {
        return ResponseEntity.ok(notificationService.listNotifications(status, type, pageable));
    }

    @PostMapping("/send")
    public ResponseEntity<MessageResponse> sendNotification(@Valid @RequestBody SendNotificationRequest request) {
        notificationService.sendNotification(request);
        return ResponseEntity.ok(MessageResponse.of("Notification queued for delivery"));
    }

    @PostMapping("/{notificationId}/retry")
    public ResponseEntity<MessageResponse> retryNotification(@PathVariable Long notificationId) {
        notificationService.retryNotification(notificationId);
        return ResponseEntity.ok(MessageResponse.of("Notification retry queued"));
    }
}