package com.compliedu.nba.controller;

import com.compliedu.nba.dto.response.AdminDashboardResponse;
import com.compliedu.nba.dto.response.InstituteDashboardResponse;
import com.compliedu.nba.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/institute")
    @PreAuthorize("hasRole('INSTITUTE')")
    public ResponseEntity<InstituteDashboardResponse> getInstituteDashboard(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getInstituteDashboard(authentication.getName()));
    }
}