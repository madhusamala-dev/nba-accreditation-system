package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sub_section_data")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SubSectionData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private SectionData section;

    @Column(name = "sub_section_number", nullable = false, length = 20)
    private String subSectionNumber;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(name = "max_marks", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal maxMarks = BigDecimal.ZERO;

    @Column(name = "institute_marks", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal instituteMarks = BigDecimal.ZERO;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;

    @Column(name = "last_modified")
    private LocalDateTime lastModified;
}