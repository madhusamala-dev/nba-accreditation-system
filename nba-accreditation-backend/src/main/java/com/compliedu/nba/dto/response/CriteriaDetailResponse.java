package com.compliedu.nba.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CriteriaDetailResponse {
    private Long id;
    private Integer criteriaNumber;
    private String title;
    private String description;
    private BigDecimal maxMarks;
    private Integer completedSections;
    private Integer totalSections;
    private BigDecimal totalMarks;
    private BigDecimal obtainedMarks;
    private List<SectionResponse> sections;
}