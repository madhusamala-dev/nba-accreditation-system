package com.compliedu.nba.dto.request;

import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UpdatePreQualifierRequest {
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
    private String facultyDepartmentName;
    private String numAlliedDepartments;
    private String numUGEnggPrograms;
    private String numPGEnggPrograms;
    private String hodName;
    private String hodAppointment;
    private String hodQualification;
    private String hodQualificationOther;

    private List<ProgramOfferedDto> programsOffered;
    private List<ProgramForAccreditationDto> programsForAccreditation;
    private List<AlliedDepartmentDto> alliedDepartments;
    private List<ProgramDetailDto> programDetails;
    private List<FacultyRowDto> facultyDetails;
    private List<FacultyCadreRowDto> facultyCadre;
    private SfrDataDto sfrData;
    private List<ComplianceRowDto> complianceStatus;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ProgramOfferedDto {
        private Long id;
        private String level;
        private String name;
        private String yearOfStart;
        private String yearOfClose;
        private String department;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ProgramForAccreditationDto {
        private Long id;
        private String department;
        private String program;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class AlliedDepartmentDto {
        private Long id;
        private String department;
        private String alliedDepartment;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ProgramDetailDto {
        private Long id;
        private String programName;
        private String yearOfStart;
        private String sanctionedIntake;
        private String intakeChange;
        private String yearOfChange;
        private String aicteApproval;
        private String accreditationStatus;
        private String timesAccredited;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class FacultyRowDto {
        private Long id;
        private String name;
        private String panNo;
        private String apaarId;
        private String highestDegree;
        private String university;
        private String specialization;
        private String dateOfJoining;
        private String designationAtJoining;
        private String dateOfJoiningDept;
        private String presentDesignation;
        private String dateDesignated;
        private String associationNature;
        private String contractType;
        private String currentlyAssociated;
        private String dateOfLeaving;
        private String experience;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class FacultyCadreRowDto {
        private Long id;
        private String designation;
        private String cayRegular;
        private String cayContract;
        private String caym1Regular;
        private String caym1Contract;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class SfrDataDto {
        private List<SfrProgramRowDto> ugPrograms;
        private List<SfrProgramRowDto> pgPrograms;
        private String cayDS;
        private String caym1DS;
        private String caym2DS;
        private String cayAS;
        private String caym1AS;
        private String caym2AS;
        private String cayDF;
        private String caym1DF;
        private String caym2DF;
        private String cayAF;
        private String caym1AF;
        private String caym2AF;
        private String cayFF;
        private String caym1FF;
        private String caym2FF;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class SfrProgramRowDto {
        private Long id;
        private String programName;
        private String cayB;
        private String cayC;
        private String cayD;
        private String caym1B;
        private String caym1C;
        private String caym1D;
        private String caym2B;
        private String caym2C;
        private String caym2D;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ComplianceRowDto {
        private Long id;
        private String qualifier;
        private String currentStatus;
        private String complianceStatus;
    }
}