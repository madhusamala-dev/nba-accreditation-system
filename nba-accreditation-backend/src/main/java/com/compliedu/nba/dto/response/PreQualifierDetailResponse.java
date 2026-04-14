package com.compliedu.nba.dto.response;

import com.compliedu.nba.dto.request.UpdatePreQualifierRequest.*;
import com.compliedu.nba.entity.enums.PreQualifierStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PreQualifierDetailResponse {
    private Long id;
    private Long institutionId;
    private String institutionName;
    private PreQualifierStatus status;
    private Integer completionPercentage;
    private LocalDateTime lastModified;
    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;

    // Part A
    private String programAppliedFor;
    private String instituteName;
    private String yearOfEstablishment;
    private String location;
    private String city;
    private String state;
    private String pinCode;
    private String website;
    private String email;
    private String phone;
    private String headName;
    private String headDesignation;
    private String headAppointmentStatus;
    private String headMobile;
    private String headTelephone;
    private String headEmail;
    private String universityName;
    private String universityCity;
    private String universityState;
    private String universityPinCode;
    private String institutionType;
    private String institutionTypeOther;
    private String ownershipStatus;
    private String ownershipStatusOther;
    private String numUGPrograms;
    private String numPGPrograms;

    // Part B
    private String facultyDepartmentName;
    private String numAlliedDepartments;
    private String numUGEnggPrograms;
    private String numPGEnggPrograms;
    private String hodName;
    private String hodAppointment;
    private String hodQualification;
    private String hodQualificationOther;

    // Nested data
    private List<ProgramOfferedDto> programsOffered;
    private List<ProgramForAccreditationDto> programsForAccreditation;
    private List<AlliedDepartmentDto> alliedDepartments;
    private List<ProgramDetailDto> programDetails;
    private List<FacultyRowDto> facultyDetails;
    private List<FacultyCadreRowDto> facultyCadre;
    private SfrDataDto sfrData;
    private List<ComplianceRowDto> complianceStatus;
}