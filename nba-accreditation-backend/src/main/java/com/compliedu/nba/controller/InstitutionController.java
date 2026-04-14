package com.compliedu.nba.controller;

import com.compliedu.nba.dto.request.CreateInstitutionRequest;
import com.compliedu.nba.dto.response.InstitutionResponse;
import com.compliedu.nba.entity.enums.AccreditationStatus;
import com.compliedu.nba.service.InstitutionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/institutions")
@RequiredArgsConstructor
public class InstitutionController {

    private final InstitutionService institutionService;

    @GetMapping
    public ResponseEntity<Page<InstitutionResponse>> listInstitutions(
            @RequestParam(required = false) AccreditationStatus status,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(institutionService.listInstitutions(status, search, pageable));
    }

    @GetMapping("/{institutionId}")
    public ResponseEntity<InstitutionResponse> getInstitutionById(@PathVariable Long institutionId) {
        return ResponseEntity.ok(institutionService.getInstitutionById(institutionId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InstitutionResponse> createInstitution(@Valid @RequestBody CreateInstitutionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(institutionService.createInstitution(request));
    }

    @PutMapping("/{institutionId}")
    public ResponseEntity<InstitutionResponse> updateInstitution(@PathVariable Long institutionId,
                                                                  @Valid @RequestBody CreateInstitutionRequest request) {
        return ResponseEntity.ok(institutionService.updateInstitution(institutionId, request));
    }

    @DeleteMapping("/{institutionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteInstitution(@PathVariable Long institutionId) {
        institutionService.deleteInstitution(institutionId);
        return ResponseEntity.noContent().build();
    }
}