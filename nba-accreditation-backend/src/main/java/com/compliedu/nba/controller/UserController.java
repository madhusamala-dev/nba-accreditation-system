package com.compliedu.nba.controller;

import com.compliedu.nba.dto.request.UpdateUserRequest;
import com.compliedu.nba.dto.response.UserResponse;
import com.compliedu.nba.entity.enums.UserRole;
import com.compliedu.nba.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserResponse>> listUsers(
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(userService.listUsers(role, search, pageable));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long userId,
                                                    @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(userId, request));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}