package com.compliedu.nba.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UpdateSectionRequest {
    private String content;
    private BigDecimal instituteMarks;
    private Boolean isCompleted;
}