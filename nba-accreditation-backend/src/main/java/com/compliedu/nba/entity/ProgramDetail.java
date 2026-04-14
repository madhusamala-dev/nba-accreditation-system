package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "program_details")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProgramDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_qualifier_id", nullable = false)
    private PreQualifier preQualifier;

    @Column(name = "program_name", length = 500)
    private String programName;

    @Column(name = "year_of_start", length = 10)
    private String yearOfStart;

    @Column(name = "sanctioned_intake", length = 20)
    private String sanctionedIntake;

    @Column(name = "intake_change", length = 200)
    private String intakeChange;

    @Column(name = "year_of_change", length = 10)
    private String yearOfChange;

    @Column(name = "aicte_approval", length = 200)
    private String aicteApproval;

    @Column(name = "accreditation_status", length = 200)
    private String accreditationStatus;

    @Column(name = "times_accredited", length = 20)
    private String timesAccredited;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}