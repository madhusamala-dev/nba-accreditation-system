package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "compliance_rows")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ComplianceRow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_qualifier_id", nullable = false)
    private PreQualifier preQualifier;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String qualifier;

    @Column(name = "current_status", length = 500)
    private String currentStatus;

    @Column(name = "compliance_status", length = 200)
    private String complianceStatus;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}