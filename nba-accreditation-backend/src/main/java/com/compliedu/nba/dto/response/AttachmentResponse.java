package com.compliedu.nba.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AttachmentResponse {
    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String downloadUrl;
    private LocalDateTime uploadedAt;
}