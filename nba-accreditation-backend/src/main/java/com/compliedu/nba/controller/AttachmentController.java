package com.compliedu.nba.controller;

import com.compliedu.nba.dto.response.AttachmentResponse;
import com.compliedu.nba.entity.Attachment;
import com.compliedu.nba.entity.enums.EntityType;
import com.compliedu.nba.service.AttachmentService;
import com.compliedu.nba.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;
    private final FileStorageService fileStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentResponse> uploadAttachment(@RequestParam("file") MultipartFile file,
                                                                @RequestParam("entityType") EntityType entityType,
                                                                @RequestParam("entityId") Long entityId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attachmentService.uploadAttachment(file, entityType, entityId));
    }

    @GetMapping("/{attachmentId}")
    public ResponseEntity<byte[]> downloadAttachment(@PathVariable Long attachmentId) {
        Attachment attachment = attachmentService.getAttachment(attachmentId);
        byte[] data = fileStorageService.loadFile(attachment.getFilePath());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(attachment.getFileType() != null ? attachment.getFileType() : "application/octet-stream"))
                .body(data);
    }

    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long attachmentId) {
        attachmentService.deleteAttachment(attachmentId);
        return ResponseEntity.noContent().build();
    }
}