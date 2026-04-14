package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "programs_offered")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProgramOffered {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_qualifier_id", nullable = false)
    private PreQualifier preQualifier;

    @Column(length = 50)
    private String level;

    @Column(length = 500)
    private String name;

    @Column(name = "year_of_start", length = 10)
    private String yearOfStart;

    @Column(name = "year_of_close", length = 10)
    private String yearOfClose;

    @Column(length = 500)
    private String department;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}