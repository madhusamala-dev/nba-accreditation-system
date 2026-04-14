package com.compliedu.nba.dto.request;

import com.compliedu.nba.entity.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UpdateUserRequest {
    @Size(max = 100)
    private String firstName;
    @Size(max = 100)
    private String lastName;
    @Email
    private String email;
    private Boolean isActive;
    private UserRole role;
}