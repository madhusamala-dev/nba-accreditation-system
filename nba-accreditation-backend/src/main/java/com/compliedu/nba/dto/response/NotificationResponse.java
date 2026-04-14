package com.compliedu.nba.dto.response;

import com.compliedu.nba.entity.enums.NotificationStatus;
import com.compliedu.nba.entity.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private String recipientEmail;
    private String recipientName;
    private String subject;
    private NotificationType notificationType;
    private NotificationStatus status;
    private Integer retryCount;
    private String errorMessage;
    private LocalDateTime sentAt;
    private LocalDateTime createdAt;
}