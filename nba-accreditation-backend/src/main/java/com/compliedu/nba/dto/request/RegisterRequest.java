package com.compliedu.nba.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class RegisterRequest {
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 6)
    private String password;
    @NotBlank @Size(max = 100)
    private String firstName;
    @NotBlank @Size(max = 100)
    private String lastName;
    private Long institutionId;
}