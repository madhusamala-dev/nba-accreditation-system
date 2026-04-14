package com.compliedu.nba.service;

import com.compliedu.nba.dto.response.AttachmentResponse;
import com.compliedu.nba.entity.Attachment;
import com.compliedu.nba.entity.enums.EntityType;
import com.compliedu.nba.exception.ResourceNotFoundException;
import com.compliedu.nba.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public AttachmentResponse uploadAttachment(MultipartFile file, EntityType entityType, Long entityId) {
        String filePath = fileStorageService.storeAttachment(file);

        Attachment attachment = Attachment.builder()
                .entityType(entityType)
                .entityId(entityId)
                .fileName(file.getOriginalFilename())
                .filePath(filePath)
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .build();

        attachment = attachmentRepository.save(attachment);

        return AttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileType(attachment.getFileType())
                .fileSize(attachment.getFileSize())
                .downloadUrl("/api/v1/attachments/" + attachment.getId())
                .uploadedAt(attachment.getUploadedAt())
                .build();
    }

    public Attachment getAttachment(Long id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", id));
    }

    @Transactional
    public void deleteAttachment(Long id) {
        Attachment attachment = getAttachment(id);
        fileStorageService.deleteFile(attachment.getFilePath());
        attachmentRepository.delete(attachment);
    }
}