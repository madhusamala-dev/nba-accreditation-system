package com.compliedu.nba.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/export")
@RequiredArgsConstructor
public class ExportController {

    @GetMapping("/pre-qualifier/{preQualifierId}/pdf")
    public ResponseEntity<byte[]> exportPreQualifierPdf(@PathVariable Long preQualifierId) {
        // TODO: Implement PDF generation with iText
        byte[] pdfContent = ("Pre-Qualifier PDF Export - ID: " + preQualifierId).getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"PQ_" + preQualifierId + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }

    @GetMapping("/sar/{sarId}/pdf")
    public ResponseEntity<byte[]> exportSarPdf(@PathVariable Long sarId) {
        // TODO: Implement PDF generation with iText
        byte[] pdfContent = ("SAR PDF Export - ID: " + sarId).getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"SAR_" + sarId + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }

    @GetMapping("/sar/{sarId}/criteria/{criteriaId}/pdf")
    public ResponseEntity<byte[]> exportCriteriaPdf(@PathVariable Long sarId, @PathVariable Long criteriaId) {
        // TODO: Implement PDF generation with iText
        byte[] pdfContent = ("Criteria PDF Export - SAR: " + sarId + " Criteria: " + criteriaId).getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Criteria_" + criteriaId + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }
}