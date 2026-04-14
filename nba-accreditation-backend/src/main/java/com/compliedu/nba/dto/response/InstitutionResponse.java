package com.compliedu.nba.dto.response;

import com.compliedu.nba.entity.enums.AccreditationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class InstitutionResponse {
    private Long id;
    private String name;
    private String address;
    private String contactEmail;
    private String contactPhone;
    private Integer establishedYear;
    private AccreditationStatus accreditationStatus;
    private String website;
    private String city;
    private String state;
    private String pinCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}