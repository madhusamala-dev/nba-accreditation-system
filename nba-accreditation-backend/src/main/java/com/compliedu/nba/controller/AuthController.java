package com.compliedu.nba.controller;

import com.compliedu.nba.dto.request.*;
import com.compliedu.nba.dto.response.LoginResponse;
import com.compliedu.nba.dto.response.MessageResponse;
import com.compliedu.nba.dto.response.UserResponse;
import com.compliedu.nba.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(MessageResponse.of("If the email exists, a reset link has been sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(MessageResponse.of("Password reset successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(authService.getCurrentUser(authentication.getName()));
    }

    @PutMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(Authentication authentication,
                                                           @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(MessageResponse.of("Password changed successfully"));
    }
}