package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "section_data")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SectionData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criteria_id", nullable = false)
    private Criteria criteria;

    @Column(name = "section_number", nullable = false, length = 20)
    private String sectionNumber;

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

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("subSectionNumber ASC")
    @Builder.Default
    private List<SubSectionData> subSections = new ArrayList<>();
}