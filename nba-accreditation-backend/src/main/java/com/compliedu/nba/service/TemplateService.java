package com.compliedu.nba.service;

import com.compliedu.nba.dto.response.TemplateResponse;
import com.compliedu.nba.entity.TemplateFile;
import com.compliedu.nba.entity.User;
import com.compliedu.nba.exception.ResourceNotFoundException;
import com.compliedu.nba.repository.TemplateFileRepository;
import com.compliedu.nba.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class TemplateService {

    private final TemplateFileRepository templateRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public Page<TemplateResponse> listTemplates(Pageable pageable) {
        return templateRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional
    public TemplateResponse uploadTemplate(MultipartFile file, String label, String uploaderEmail) {
        User uploader = userRepository.findByEmail(uploaderEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", uploaderEmail));

        String filePath = fileStorageService.storeTemplate(file);

        TemplateFile template = TemplateFile.builder()
                .label(label)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .filePath(filePath)
                .uploadedBy(uploader)
                .build();

        template = templateRepository.save(template);
        return mapToResponse(template);
    }

    public TemplateFile getTemplate(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template", "id", id));
    }

    @Transactional
    public void deleteTemplate(Long id) {
        TemplateFile template = getTemplate(id);
        fileStorageService.deleteFile(template.getFilePath());
        templateRepository.delete(template);
    }

    private TemplateResponse mapToResponse(TemplateFile t) {
        return TemplateResponse.builder()
                .id(t.getId())
                .label(t.getLabel())
                .fileName(t.getFileName())
                .fileType(t.getFileType())
                .fileSize(t.getFileSize())
                .downloadUrl("/api/v1/templates/" + t.getId())
                .uploadedAt(t.getUploadedAt())
                .uploadedBy(t.getUploadedBy().getFirstName() + " " + t.getUploadedBy().getLastName())
                .build();
    }
}