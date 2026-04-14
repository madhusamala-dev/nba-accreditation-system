package com.compliedu.nba.service;

import com.compliedu.nba.dto.request.SendNotificationRequest;
import com.compliedu.nba.dto.response.NotificationResponse;
import com.compliedu.nba.entity.EmailNotification;
import com.compliedu.nba.entity.enums.NotificationStatus;
import com.compliedu.nba.entity.enums.NotificationType;
import com.compliedu.nba.exception.ResourceNotFoundException;
import com.compliedu.nba.repository.EmailNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailNotificationService {

    private final EmailNotificationRepository notificationRepository;
    private final JavaMailSender mailSender;

    public Page<NotificationResponse> listNotifications(NotificationStatus status, NotificationType type, Pageable pageable) {
        return notificationRepository.findAllWithFilters(status, type, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public void sendNotification(SendNotificationRequest request) {
        EmailNotification notification = EmailNotification.builder()
                .recipientEmail(request.getRecipientEmail())
                .recipientName(request.getRecipientName())
                .subject(request.getSubject())
                .body(request.getBody())
                .notificationType(request.getNotificationType())
                .build();

        notification = notificationRepository.save(notification);
        sendEmailAsync(notification);
    }

    @Transactional
    public void retryNotification(Long notificationId) {
        EmailNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        sendEmailAsync(notification);
    }

    @Async
    public void sendEmailAsync(EmailNotification notification) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(notification.getRecipientEmail());
            helper.setSubject(notification.getSubject());
            helper.setText(notification.getBody(), true);

            mailSender.send(message);

            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", notification.getRecipientEmail(), e.getMessage());
            notification.setStatus(NotificationStatus.FAILED);
            notification.setRetryCount(notification.getRetryCount() + 1);
            notification.setErrorMessage(e.getMessage());
        }
        notificationRepository.save(notification);
    }

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void processFailedNotifications() {
        List<EmailNotification> failed = notificationRepository
                .findByStatusAndRetryCountLessThan(NotificationStatus.FAILED, 3);
        for (EmailNotification notification : failed) {
            sendEmailAsync(notification);
        }
    }

    private NotificationResponse mapToResponse(EmailNotification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .recipientEmail(n.getRecipientEmail())
                .recipientName(n.getRecipientName())
                .subject(n.getSubject())
                .notificationType(n.getNotificationType())
                .status(n.getStatus())
                .retryCount(n.getRetryCount())
                .errorMessage(n.getErrorMessage())
                .sentAt(n.getSentAt())
                .createdAt(n.getCreatedAt())
                .build();
    }
}