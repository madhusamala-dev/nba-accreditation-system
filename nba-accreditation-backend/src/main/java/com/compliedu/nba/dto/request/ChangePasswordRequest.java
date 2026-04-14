package com.compliedu.nba.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ChangePasswordRequest {
    @NotBlank
    private String currentPassword;
    @NotBlank @Size(min = 6)
    private String newPassword;
}