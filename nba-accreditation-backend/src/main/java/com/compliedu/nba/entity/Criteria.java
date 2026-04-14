package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "criteria", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"sar_application_id", "criteria_number"})
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Criteria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sar_application_id", nullable = false)
    private SarApplication sarApplication;

    @Column(name = "criteria_number", nullable = false)
    private Integer criteriaNumber;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "max_marks", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal maxMarks = BigDecimal.ZERO;

    @Column(name = "completed_sections", nullable = false)
    @Builder.Default
    private Integer completedSections = 0;

    @Column(name = "total_marks", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalMarks = BigDecimal.ZERO;

    @Column(name = "obtained_marks", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal obtainedMarks = BigDecimal.ZERO;

    @OneToMany(mappedBy = "criteria", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sectionNumber ASC")
    @Builder.Default
    private List<SectionData> sections = new ArrayList<>();
}