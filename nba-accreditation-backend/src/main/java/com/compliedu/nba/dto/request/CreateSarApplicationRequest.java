package com.compliedu.nba.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CreateSarApplicationRequest {
    @NotNull
    private Long institutionId;
    @NotBlank
    private String departmentName;
    private LocalDateTime applicationStartDate;
    private LocalDateTime applicationEndDate;
}