package com.compliedu.nba.service;

import com.compliedu.nba.dto.request.UpdateUserRequest;
import com.compliedu.nba.dto.response.UserResponse;
import com.compliedu.nba.entity.User;
import com.compliedu.nba.entity.enums.UserRole;
import com.compliedu.nba.exception.ResourceNotFoundException;
import com.compliedu.nba.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;

    public Page<UserResponse> listUsers(UserRole role, String search, Pageable pageable) {
        return userRepository.findAllWithFilters(role, search, pageable)
                .map(authService::mapToUserResponse);
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return authService.mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getIsActive() != null) user.setIsActive(request.getIsActive());
        if (request.getRole() != null) user.setRole(request.getRole());

        user = userRepository.save(user);
        return authService.mapToUserResponse(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        userRepository.deleteById(userId);
    }
}