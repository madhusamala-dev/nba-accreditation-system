package com.compliedu.nba.service;

import com.compliedu.nba.dto.response.AdminDashboardResponse;
import com.compliedu.nba.dto.response.InstituteDashboardResponse;
import com.compliedu.nba.entity.PreQualifier;
import com.compliedu.nba.entity.SarApplication;
import com.compliedu.nba.entity.User;
import com.compliedu.nba.entity.enums.*;
import com.compliedu.nba.exception.ResourceNotFoundException;
import com.compliedu.nba.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final InstitutionRepository institutionRepository;
    private final UserRepository userRepository;
    private final PreQualifierRepository preQualifierRepository;
    private final SarApplicationRepository sarRepository;
    private final EmailNotificationRepository emailRepository;

    public AdminDashboardResponse getAdminDashboard() {
        return AdminDashboardResponse.builder()
                .totalInstitutions(institutionRepository.count())
                .totalUsers(userRepository.count())
                .pendingPreQualifiers(preQualifierRepository.countByStatus(PreQualifierStatus.IN_PROGRESS))
                .submittedPreQualifiers(preQualifierRepository.countByStatus(PreQualifierStatus.SUBMITTED))
                .pendingSARApplications(sarRepository.countByStatus(SarStatus.IN_PROGRESS))
                .submittedSARApplications(sarRepository.countByStatus(SarStatus.SUBMITTED))
                .approvedSARApplications(sarRepository.countByStatus(SarStatus.APPROVED))
                .rejectedSARApplications(sarRepository.countByStatus(SarStatus.REJECTED))
                .emailStats(AdminDashboardResponse.EmailStats.builder()
                        .totalSent(emailRepository.countByStatus(NotificationStatus.SENT))
                        .totalPending(emailRepository.countByStatus(NotificationStatus.PENDING))
                        .totalFailed(emailRepository.countByStatus(NotificationStatus.FAILED))
                        .build())
                .build();
    }

    public InstituteDashboardResponse getInstituteDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (user.getInstitution() == null) {
            throw new ResourceNotFoundException("Institution not associated with user");
        }

        Long institutionId = user.getInstitution().getId();

        PreQualifier latestPq = preQualifierRepository
                .findFirstByInstitutionIdOrderByCreatedAtDesc(institutionId).orElse(null);

        List<SarApplication> sarApps = sarRepository.findByInstitutionId(institutionId);

        return InstituteDashboardResponse.builder()
                .institutionName(user.getInstitution().getName())
                .accreditationStatus(user.getInstitution().getAccreditationStatus())
                .preQualifierStatus(latestPq != null ? latestPq.getStatus() : null)
                .preQualifierCompletion(latestPq != null ? latestPq.getCompletionPercentage() : 0)
                .sarApplications(sarApps.stream().map(sa -> InstituteDashboardResponse.SarSummary.builder()
                        .id(sa.getId())
                        .departmentName(sa.getDepartmentName())
                        .status(sa.getStatus().name())
                        .completionPercentage(sa.getCompletionPercentage())
                        .lastModified(sa.getLastModified() != null ? sa.getLastModified().toString() : null)
                        .build()).collect(Collectors.toList()))
                .build();
    }
}