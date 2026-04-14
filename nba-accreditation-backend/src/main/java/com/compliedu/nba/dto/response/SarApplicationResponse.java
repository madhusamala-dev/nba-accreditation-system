package com.compliedu.nba.dto.response;

import com.compliedu.nba.entity.enums.SarStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SarApplicationResponse {
    private Long id;
    private String applicationId;
    private Long institutionId;
    private String institutionName;
    private String departmentName;
    private LocalDateTime applicationStartDate;
    private LocalDateTime applicationEndDate;
    private SarStatus status;
    private Integer completionPercentage;
    private BigDecimal overallMarks;
    private BigDecimal maxOverallMarks;
    private LocalDateTime lastModified;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;
}