package com.compliedu.nba.dto.response;

import com.compliedu.nba.entity.enums.AccreditationStatus;
import com.compliedu.nba.entity.enums.PreQualifierStatus;
import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class InstituteDashboardResponse {
    private String institutionName;
    private AccreditationStatus accreditationStatus;
    private PreQualifierStatus preQualifierStatus;
    private Integer preQualifierCompletion;
    private List<SarSummary> sarApplications;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SarSummary {
        private Long id;
        private String departmentName;
        private String status;
        private Integer completionPercentage;
        private String lastModified;
    }
}