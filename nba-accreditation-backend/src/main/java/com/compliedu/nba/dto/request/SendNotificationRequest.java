package com.compliedu.nba.dto.request;

import com.compliedu.nba.entity.enums.NotificationType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class SendNotificationRequest {
    @NotBlank @Email
    private String recipientEmail;
    private String recipientName;
    @NotBlank
    private String subject;
    @NotBlank
    private String body;
    @NotNull
    private NotificationType notificationType;
}