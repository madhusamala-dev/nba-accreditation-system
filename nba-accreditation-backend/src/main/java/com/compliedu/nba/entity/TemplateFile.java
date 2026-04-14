package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "template_files")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TemplateFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String label;

    @Column(name = "file_name", nullable = false, length = 500)
    private String fileName;

    @Column(name = "file_type", length = 100)
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_path", nullable = false, length = 1000)
    private String filePath;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;
}