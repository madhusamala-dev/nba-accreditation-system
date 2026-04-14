package com.compliedu.nba.controller;

import com.compliedu.nba.dto.response.TemplateResponse;
import com.compliedu.nba.entity.TemplateFile;
import com.compliedu.nba.service.FileStorageService;
import com.compliedu.nba.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateService templateService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<Page<TemplateResponse>> listTemplates(Pageable pageable) {
        return ResponseEntity.ok(templateService.listTemplates(pageable));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TemplateResponse> uploadTemplate(@RequestParam("file") MultipartFile file,
                                                            @RequestParam("label") String label,
                                                            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(templateService.uploadTemplate(file, label, authentication.getName()));
    }

    @GetMapping("/{templateId}")
    public ResponseEntity<byte[]> downloadTemplate(@PathVariable Long templateId) {
        TemplateFile template = templateService.getTemplate(templateId);
        byte[] data = fileStorageService.loadFile(template.getFilePath());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + template.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(template.getFileType() != null ? template.getFileType() : "application/octet-stream"))
                .body(data);
    }

    @DeleteMapping("/{templateId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long templateId) {
        templateService.deleteTemplate(templateId);
        return ResponseEntity.noContent().build();
    }
}