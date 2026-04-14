package com.compliedu.nba.service;

import com.compliedu.nba.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.templates-dir}")
    private String templatesDir;

    @Value("${file.attachments-dir}")
    private String attachmentsDir;

    public String storeAttachment(MultipartFile file) {
        return storeFile(file, attachmentsDir);
    }

    public String storeTemplate(MultipartFile file) {
        return storeFile(file, templatesDir);
    }

    private String storeFile(MultipartFile file, String directory) {
        try {
            Path dirPath = Paths.get(directory);
            Files.createDirectories(dirPath);

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String storedFilename = UUID.randomUUID().toString() + extension;

            Path filePath = dirPath.resolve(storedFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return filePath.toString();
        } catch (IOException e) {
            throw new BadRequestException("Failed to store file: " + e.getMessage());
        }
    }

    public byte[] loadFile(String filePath) {
        try {
            return Files.readAllBytes(Paths.get(filePath));
        } catch (IOException e) {
            throw new BadRequestException("Failed to load file: " + e.getMessage());
        }
    }

    public void deleteFile(String filePath) {
        try {
            Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException e) {
            // Log warning but don't throw
        }
    }
}