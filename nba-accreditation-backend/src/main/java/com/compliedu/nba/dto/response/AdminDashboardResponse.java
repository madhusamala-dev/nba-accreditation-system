package com.compliedu.nba.dto.response;

import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AdminDashboardResponse {
    private long totalInstitutions;
    private long totalUsers;
    private long pendingPreQualifiers;
    private long submittedPreQualifiers;
    private long pendingSARApplications;
    private long submittedSARApplications;
    private long approvedSARApplications;
    private long rejectedSARApplications;
    private EmailStats emailStats;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class EmailStats {
        private long totalSent;
        private long totalPending;
        private long totalFailed;
    }
}