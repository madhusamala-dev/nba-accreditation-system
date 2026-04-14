package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sfr_program_rows")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SfrProgramRow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sfr_data_id", nullable = false)
    private SfrData sfrData;

    @Enumerated(EnumType.STRING)
    @Column(name = "program_type", nullable = false)
    private ProgramType programType;

    @Column(name = "program_name", length = 500)
    private String programName;

    @Column(name = "cay_b", length = 20)
    private String cayB;
    @Column(name = "cay_c", length = 20)
    private String cayC;
    @Column(name = "cay_d", length = 20)
    private String cayD;

    @Column(name = "caym1_b", length = 20)
    private String caym1B;
    @Column(name = "caym1_c", length = 20)
    private String caym1C;
    @Column(name = "caym1_d", length = 20)
    private String caym1D;

    @Column(name = "caym2_b", length = 20)
    private String caym2B;
    @Column(name = "caym2_c", length = 20)
    private String caym2C;
    @Column(name = "caym2_d", length = 20)
    private String caym2D;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    public enum ProgramType {
        UG, PG
    }
}