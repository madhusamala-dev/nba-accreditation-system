package com.compliedu.nba.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SubSectionResponse {
    private Long id;
    private String subSectionNumber;
    private String title;
    private BigDecimal maxMarks;
    private BigDecimal instituteMarks;
    private String content;
    private List<AttachmentResponse> attachments;
    private Boolean isCompleted;
    private LocalDateTime lastModified;
}