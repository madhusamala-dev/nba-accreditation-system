package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "allied_departments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AlliedDepartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_qualifier_id", nullable = false)
    private PreQualifier preQualifier;

    @Column(length = 500)
    private String department;

    @Column(name = "allied_department", length = 500)
    private String alliedDepartment;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}