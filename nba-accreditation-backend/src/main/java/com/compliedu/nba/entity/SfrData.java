package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sfr_data")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SfrData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_qualifier_id", nullable = false, unique = true)
    private PreQualifier preQualifier;

    @Column(name = "cay_ds", length = 20)
    private String cayDS;
    @Column(name = "caym1_ds", length = 20)
    private String caym1DS;
    @Column(name = "caym2_ds", length = 20)
    private String caym2DS;

    @Column(name = "cay_as", length = 20)
    private String cayAS;
    @Column(name = "caym1_as", length = 20)
    private String caym1AS;
    @Column(name = "caym2_as", length = 20)
    private String caym2AS;

    @Column(name = "cay_df", length = 20)
    private String cayDF;
    @Column(name = "caym1_df", length = 20)
    private String caym1DF;
    @Column(name = "caym2_df", length = 20)
    private String caym2DF;

    @Column(name = "cay_af", length = 20)
    private String cayAF;
    @Column(name = "caym1_af", length = 20)
    private String caym1AF;
    @Column(name = "caym2_af", length = 20)
    private String caym2AF;

    @Column(name = "cay_ff", length = 20)
    private String cayFF;
    @Column(name = "caym1_ff", length = 20)
    private String caym1FF;
    @Column(name = "caym2_ff", length = 20)
    private String caym2FF;

    @OneToMany(mappedBy = "sfrData", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<SfrProgramRow> programRows = new ArrayList<>();
}