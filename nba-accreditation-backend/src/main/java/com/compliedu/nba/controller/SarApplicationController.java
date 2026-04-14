package com.compliedu.nba.controller;

import com.compliedu.nba.dto.request.*;
import com.compliedu.nba.dto.response.*;
import com.compliedu.nba.entity.enums.SarStatus;
import com.compliedu.nba.service.SarApplicationService;
import com.compliedu.nba.service.SectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sar-applications")
@RequiredArgsConstructor
public class SarApplicationController {

    private final SarApplicationService sarService;
    private final SectionService sectionService;

    @GetMapping
    public ResponseEntity<Page<SarApplicationResponse>> listSarApplications(
            @RequestParam(required = false) SarStatus status,
            @RequestParam(required = false) Long institutionId,
            @RequestParam(required = false) String departmentName,
            Pageable pageable) {
        return ResponseEntity.ok(sarService.listSarApplications(status, institutionId, departmentName, pageable));
    }

    @PostMapping
    public ResponseEntity<SarApplicationResponse> createSarApplication(@Valid @RequestBody CreateSarApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sarService.createSarApplication(request));
    }

    @GetMapping("/{sarId}")
    public ResponseEntity<SarApplicationDetailResponse> getSarApplicationById(@PathVariable Long sarId) {
        return ResponseEntity.ok(sarService.getSarApplicationById(sarId));
    }

    @PutMapping("/{sarId}")
    public ResponseEntity<SarApplicationResponse> updateSarApplication(@PathVariable Long sarId,
                                                                        @RequestBody UpdateSarApplicationRequest request) {
        return ResponseEntity.ok(sarService.updateSarApplication(sarId, request));
    }

    @DeleteMapping("/{sarId}")
    public ResponseEntity<Void> deleteSarApplication(@PathVariable Long sarId) {
        sarService.deleteSarApplication(sarId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{sarId}/submit")
    public ResponseEntity<SarApplicationResponse> submitSarApplication(@PathVariable Long sarId) {
        return ResponseEntity.ok(sarService.submitSarApplication(sarId));
    }

    @PostMapping("/{sarId}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> reviewSarApplication(@PathVariable Long sarId,
                                                                  @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(MessageResponse.of("Review completed: " + request.getAction()));
    }

    // Criteria endpoints
    @GetMapping("/{sarId}/criteria")
    public ResponseEntity<List<CriteriaResponse>> listCriteria(@PathVariable Long sarId) {
        return ResponseEntity.ok(sectionService.listCriteria(sarId));
    }

    @GetMapping("/{sarId}/criteria/{criteriaId}")
    public ResponseEntity<SarApplicationDetailResponse> getCriteriaById(@PathVariable Long sarId,
                                                                         @PathVariable Long criteriaId) {
        return ResponseEntity.ok(sarService.getSarApplicationById(sarId));
    }

    // Section endpoints
    @PutMapping("/{sarId}/criteria/{criteriaId}/sections/{sectionId}")
    public ResponseEntity<SectionResponse> updateSection(@PathVariable Long sarId,
                                                          @PathVariable Long criteriaId,
                                                          @PathVariable Long sectionId,
                                                          @RequestBody UpdateSectionRequest request) {
        return ResponseEntity.ok(sectionService.updateSection(sarId, criteriaId, sectionId, request));
    }

    @PutMapping("/{sarId}/criteria/{criteriaId}/sections/{sectionId}/sub-sections/{subSectionId}")
    public ResponseEntity<SubSectionResponse> updateSubSection(@PathVariable Long sarId,
                                                                @PathVariable Long criteriaId,
                                                                @PathVariable Long sectionId,
                                                                @PathVariable Long subSectionId,
                                                                @RequestBody UpdateSubSectionRequest request) {
        return ResponseEntity.ok(sectionService.updateSubSection(sarId, criteriaId, sectionId, subSectionId, request));
    }
}