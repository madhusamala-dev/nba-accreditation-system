package com.compliedu.nba.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CreateInstitutionRequest {
    @NotBlank @Size(max = 500)
    private String name;
    private String address;
    private String contactEmail;
    private String contactPhone;
    private Integer establishedYear;
    private String website;
    private String city;
    private String state;
    private String pinCode;
}