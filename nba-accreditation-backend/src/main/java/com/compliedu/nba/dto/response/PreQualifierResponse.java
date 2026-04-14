package com.compliedu.nba.dto.response;

import com.compliedu.nba.entity.enums.PreQualifierStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PreQualifierResponse {
    private Long id;
    private Long institutionId;
    private String institutionName;
    private PreQualifierStatus status;
    private Integer completionPercentage;
    private LocalDateTime lastModified;
    private LocalDateTime submittedAt;
    private String programAppliedFor;
    private String instituteName;
    private LocalDateTime createdAt;
}