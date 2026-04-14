package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "programs_for_accreditation")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProgramForAccreditation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_qualifier_id", nullable = false)
    private PreQualifier preQualifier;

    @Column(length = 500)
    private String department;

    @Column(length = 500)
    private String program;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}