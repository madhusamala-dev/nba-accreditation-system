package com.compliedu.nba.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "faculty_rows")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FacultyRow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_qualifier_id", nullable = false)
    private PreQualifier preQualifier;

    @Column(length = 300)
    private String name;

    @Column(name = "pan_no", length = 20)
    private String panNo;

    @Column(name = "apaar_id", length = 50)
    private String apaarId;

    @Column(name = "highest_degree", length = 100)
    private String highestDegree;

    @Column(length = 500)
    private String university;

    @Column(length = 500)
    private String specialization;

    @Column(name = "date_of_joining")
    private LocalDate dateOfJoining;

    @Column(name = "designation_at_joining", length = 200)
    private String designationAtJoining;

    @Column(name = "date_of_joining_dept")
    private LocalDate dateOfJoiningDept;

    @Column(name = "present_designation", length = 200)
    private String presentDesignation;

    @Column(name = "date_designated")
    private LocalDate dateDesignated;

    @Column(name = "association_nature", length = 200)
    private String associationNature;

    @Column(name = "contract_type", length = 200)
    private String contractType;

    @Column(name = "currently_associated", length = 10)
    private String currentlyAssociated;

    @Column(name = "date_of_leaving")
    private LocalDate dateOfLeaving;

    @Column(length = 100)
    private String experience;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}