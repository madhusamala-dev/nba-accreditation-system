package com.compliedu.nba.entity;

import com.compliedu.nba.entity.enums.PreQualifierStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pre_qualifiers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PreQualifier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PreQualifierStatus status = PreQualifierStatus.DRAFT;

    @Column(name = "completion_percentage", nullable = false)
    @Builder.Default
    private Integer completionPercentage = 0;

    @Column(name = "last_modified")
    private LocalDateTime lastModified;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    // Part A fields
    @Column(name = "program_applied_for", length = 500)
    private String programAppliedFor;

    @Column(name = "institute_name", length = 500)
    private String instituteName;

    @Column(name = "year_of_establishment", length = 10)
    private String yearOfEstablishment;

    @Column(length = 500)
    private String location;

    @Column(length = 200)
    private String city;

    @Column(length = 200)
    private String state;

    @Column(name = "pin_code", length = 20)
    private String pinCode;

    @Column(length = 500)
    private String website;

    @Column(length = 255)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(name = "head_name", length = 300)
    private String headName;

    @Column(name = "head_designation", length = 200)
    private String headDesignation;

    @Column(name = "head_appointment_status", length = 200)
    private String headAppointmentStatus;

    @Column(name = "head_mobile", length = 50)
    private String headMobile;

    @Column(name = "head_telephone", length = 50)
    private String headTelephone;

    @Column(name = "head_email", length = 255)
    private String headEmail;

    @Column(name = "university_name", length = 500)
    private String universityName;

    @Column(name = "university_city", length = 200)
    private String universityCity;

    @Column(name = "university_state", length = 200)
    private String universityState;

    @Column(name = "university_pin_code", length = 20)
    private String universityPinCode;

    @Column(name = "institution_type", length = 200)
    private String institutionType;

    @Column(name = "institution_type_other", length = 500)
    private String institutionTypeOther;

    @Column(name = "ownership_status", length = 200)
    private String ownershipStatus;

    @Column(name = "ownership_status_other", length = 500)
    private String ownershipStatusOther;

    @Column(name = "num_ug_programs", length = 10)
    private String numUGPrograms;

    @Column(name = "num_pg_programs", length = 10)
    private String numPGPrograms;

    // Part B fields
    @Column(name = "faculty_department_name", length = 500)
    private String facultyDepartmentName;

    @Column(name = "num_allied_departments", length = 10)
    private String numAlliedDepartments;

    @Column(name = "num_ug_engg_programs", length = 10)
    private String numUGEnggPrograms;

    @Column(name = "num_pg_engg_programs", length = 10)
    private String numPGEnggPrograms;

    @Column(name = "hod_name", length = 300)
    private String hodName;

    @Column(name = "hod_appointment", length = 200)
    private String hodAppointment;

    @Column(name = "hod_qualification", length = 200)
    private String hodQualification;

    @Column(name = "hod_qualification_other", length = 500)
    private String hodQualificationOther;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Relationships
    @OneToMany(mappedBy = "preQualifier", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<ProgramOffered> programsOffered = new ArrayList<>();

    @OneToMany(mappedBy = "preQualifier", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<ProgramForAccreditation> programsForAccreditation = new ArrayList<>();

    @OneToMany(mappedBy = "preQualifier", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<AlliedDepartment> alliedDepartments = new ArrayList<>();

    @OneToMany(mappedBy = "preQualifier", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<ProgramDetail> programDetails = new ArrayList<>();

    @OneToMany(mappedBy = "preQualifier", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<FacultyRow> facultyDetails = new ArrayList<>();

    @OneToMany(mappedBy = "preQualifier", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<FacultyCadreRow> facultyCadre = new ArrayList<>();

    @OneToOne(mappedBy = "preQualifier", cascade = CascadeType.ALL, orphanRemoval = true)
    private SfrData sfrData;

    @OneToMany(mappedBy = "preQualifier", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<ComplianceRow> complianceStatus = new ArrayList<>();
}