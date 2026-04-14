package com.compliedu.nba.entity;

import com.compliedu.nba.entity.enums.EntityType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "attachments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false)
    private EntityType entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "file_name", nullable = false, length = 500)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 1000)
    private String filePath;

    @Column(name = "file_type", length = 100)
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;
}