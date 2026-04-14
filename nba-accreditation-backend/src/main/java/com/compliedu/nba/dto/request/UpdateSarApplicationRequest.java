package com.compliedu.nba.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UpdateSarApplicationRequest {
    private String departmentName;
    private LocalDateTime applicationEndDate;
    private String status; // DRAFT, IN_PROGRESS, COMPLETED only
}