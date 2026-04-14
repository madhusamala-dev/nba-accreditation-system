package com.compliedu.nba.dto.response;

import com.compliedu.nba.entity.enums.UserRole;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private UserRole role;
    private String firstName;
    private String lastName;
    private Long institutionId;
    private String institutionName;
    private Boolean isActive;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
}