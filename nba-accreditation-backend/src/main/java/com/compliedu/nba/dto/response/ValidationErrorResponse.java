package com.compliedu.nba.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ValidationErrorResponse {
    private int status;
    private String error;
    private String message;
    private List<FieldErrorDto> errors;
    private LocalDateTime timestamp;

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    public static class FieldErrorDto {
        private String field;
        private String message;
    }
}