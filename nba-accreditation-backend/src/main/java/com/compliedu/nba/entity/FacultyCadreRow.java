package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "faculty_cadre_rows")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FacultyCadreRow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_qualifier_id", nullable = false)
    private PreQualifier preQualifier;

    @Column(length = 500)
    private String designation;

    @Column(name = "cay_regular", length = 20)
    private String cayRegular;

    @Column(name = "cay_contract", length = 20)
    private String cayContract;

    @Column(name = "caym1_regular", length = 20)
    private String caym1Regular;

    @Column(name = "caym1_contract", length = 20)
    private String caym1Contract;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}