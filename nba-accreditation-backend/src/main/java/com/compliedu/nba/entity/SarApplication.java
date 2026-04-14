package com.compliedu.nba.entity;

import com.compliedu.nba.entity.enums.SarStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sar_applications")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SarApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", nullable = false, unique = true, length = 100)
    private String applicationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @Column(name = "department_name", nullable = false, length = 500)
    private String departmentName;

    @Column(name = "application_start_date")
    private LocalDateTime applicationStartDate;

    @Column(name = "application_end_date")
    private LocalDateTime applicationEndDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SarStatus status = SarStatus.DRAFT;

    @Column(name = "completion_percentage", nullable = false)
    @Builder.Default
    private Integer completionPercentage = 0;

    @Column(name = "overall_marks", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal overallMarks = BigDecimal.ZERO;

    @Column(name = "max_overall_marks", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal maxOverallMarks = BigDecimal.ZERO;

    @Column(name = "last_modified")
    private LocalDateTime lastModified;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "sarApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("criteriaNumber ASC")
    @Builder.Default
    private List<Criteria> criteria = new ArrayList<>();
}