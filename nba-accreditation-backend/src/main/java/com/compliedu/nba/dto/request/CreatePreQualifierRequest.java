package com.compliedu.nba.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CreatePreQualifierRequest {
    @NotNull
    private Long institutionId;
    private String programAppliedFor;
}