package com.compliedu.nba.service;

import com.compliedu.nba.dto.request.*;
import com.compliedu.nba.dto.response.LoginResponse;
import com.compliedu.nba.dto.response.UserResponse;
import com.compliedu.nba.entity.Institution;
import com.compliedu.nba.entity.User;
import com.compliedu.nba.entity.enums.UserRole;
import com.compliedu.nba.exception.BadRequestException;
import com.compliedu.nba.exception.DuplicateResourceException;
import com.compliedu.nba.exception.ResourceNotFoundException;
import com.compliedu.nba.repository.InstitutionRepository;
import com.compliedu.nba.repository.UserRepository;
import com.compliedu.nba.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        return LoginResponse.builder()
                .token(token)
                .expiresIn(tokenProvider.getExpirationInSeconds())
                .user(mapToUserResponse(user))
                .build();
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        Institution institution = null;
        if (request.getInstitutionId() != null) {
            institution = institutionRepository.findById(request.getInstitutionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", request.getInstitutionId()));
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.INSTITUTE)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .institution(institution)
                .isActive(true)
                .emailVerified(false)
                .build();

        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            user.setResetToken(UUID.randomUUID().toString());
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(24));
            userRepository.save(user);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToUserResponse(user);
    }

    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .institutionId(user.getInstitution() != null ? user.getInstitution().getId() : null)
                .institutionName(user.getInstitution() != null ? user.getInstitution().getName() : null)
                .isActive(user.getIsActive())
                .emailVerified(user.getEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}