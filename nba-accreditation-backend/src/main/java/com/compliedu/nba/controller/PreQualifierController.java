package com.compliedu.nba.controller;

import com.compliedu.nba.dto.request.CreatePreQualifierRequest;
import com.compliedu.nba.dto.request.ReviewRequest;
import com.compliedu.nba.dto.request.UpdatePreQualifierRequest;
import com.compliedu.nba.dto.response.MessageResponse;
import com.compliedu.nba.dto.response.PreQualifierDetailResponse;
import com.compliedu.nba.dto.response.PreQualifierResponse;
import com.compliedu.nba.entity.enums.PreQualifierStatus;
import com.compliedu.nba.service.PreQualifierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pre-qualifiers")
@RequiredArgsConstructor
public class PreQualifierController {

    private final PreQualifierService preQualifierService;

    @GetMapping
    public ResponseEntity<Page<PreQualifierResponse>> listPreQualifiers(
            @RequestParam(required = false) PreQualifierStatus status,
            @RequestParam(required = false) Long institutionId,
            Pageable pageable) {
        return ResponseEntity.ok(preQualifierService.listPreQualifiers(status, institutionId, pageable));
    }

    @PostMapping
    public ResponseEntity<PreQualifierResponse> createPreQualifier(@Valid @RequestBody CreatePreQualifierRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(preQualifierService.createPreQualifier(request));
    }

    @GetMapping("/{preQualifierId}")
    public ResponseEntity<PreQualifierDetailResponse> getPreQualifierById(@PathVariable Long preQualifierId) {
        return ResponseEntity.ok(preQualifierService.getPreQualifierById(preQualifierId));
    }

    @PutMapping("/{preQualifierId}")
    public ResponseEntity<PreQualifierDetailResponse> updatePreQualifier(@PathVariable Long preQualifierId,
                                                                          @RequestBody UpdatePreQualifierRequest request) {
        return ResponseEntity.ok(preQualifierService.updatePreQualifier(preQualifierId, request));
    }

    @DeleteMapping("/{preQualifierId}")
    public ResponseEntity<Void> deletePreQualifier(@PathVariable Long preQualifierId) {
        preQualifierService.deletePreQualifier(preQualifierId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{preQualifierId}/submit")
    public ResponseEntity<PreQualifierDetailResponse> submitPreQualifier(@PathVariable Long preQualifierId) {
        return ResponseEntity.ok(preQualifierService.submitPreQualifier(preQualifierId));
    }

    @PostMapping("/{preQualifierId}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> reviewPreQualifier(@PathVariable Long preQualifierId,
                                                               @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(MessageResponse.of("Review completed: " + request.getAction()));
    }
}