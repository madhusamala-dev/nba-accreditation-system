package com.compliedu.nba.service;

import com.compliedu.nba.dto.request.CreatePreQualifierRequest;
import com.compliedu.nba.dto.request.UpdatePreQualifierRequest;
import com.compliedu.nba.dto.response.PreQualifierDetailResponse;
import com.compliedu.nba.dto.response.PreQualifierResponse;
import com.compliedu.nba.entity.*;
import com.compliedu.nba.entity.enums.PreQualifierStatus;
import com.compliedu.nba.exception.BadRequestException;
import com.compliedu.nba.exception.ResourceNotFoundException;
import com.compliedu.nba.repository.InstitutionRepository;
import com.compliedu.nba.repository.PreQualifierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class PreQualifierService {

    private final PreQualifierRepository preQualifierRepository;
    private final InstitutionRepository institutionRepository;

    public Page<PreQualifierResponse> listPreQualifiers(PreQualifierStatus status, Long institutionId, Pageable pageable) {
        return preQualifierRepository.findAllWithFilters(status, institutionId, pageable)
                .map(this::mapToResponse);
    }

    public PreQualifierDetailResponse getPreQualifierById(Long id) {
        PreQualifier pq = preQualifierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PreQualifier", "id", id));
        return mapToDetailResponse(pq);
    }

    @Transactional
    public PreQualifierResponse createPreQualifier(CreatePreQualifierRequest request) {
        Institution institution = institutionRepository.findById(request.getInstitutionId())
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", request.getInstitutionId()));

        PreQualifier pq = PreQualifier.builder()
                .institution(institution)
                .programAppliedFor(request.getProgramAppliedFor())
                .lastModified(LocalDateTime.now())
                .build();

        pq = preQualifierRepository.save(pq);
        return mapToResponse(pq);
    }

    @Transactional
    public PreQualifierDetailResponse updatePreQualifier(Long id, UpdatePreQualifierRequest req) {
        PreQualifier pq = preQualifierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PreQualifier", "id", id));

        // Update scalar fields
        if (req.getProgramAppliedFor() != null) pq.setProgramAppliedFor(req.getProgramAppliedFor());
        if (req.getInstituteName() != null) pq.setInstituteName(req.getInstituteName());
        if (req.getYearOfEstablishment() != null) pq.setYearOfEstablishment(req.getYearOfEstablishment());
        if (req.getLocation() != null) pq.setLocation(req.getLocation());
        if (req.getCity() != null) pq.setCity(req.getCity());
        if (req.getState() != null) pq.setState(req.getState());
        if (req.getPinCode() != null) pq.setPinCode(req.getPinCode());
        if (req.getWebsite() != null) pq.setWebsite(req.getWebsite());
        if (req.getEmail() != null) pq.setEmail(req.getEmail());
        if (req.getPhone() != null) pq.setPhone(req.getPhone());
        if (req.getHeadName() != null) pq.setHeadName(req.getHeadName());
        if (req.getHeadDesignation() != null) pq.setHeadDesignation(req.getHeadDesignation());
        if (req.getHeadAppointmentStatus() != null) pq.setHeadAppointmentStatus(req.getHeadAppointmentStatus());
        if (req.getHeadMobile() != null) pq.setHeadMobile(req.getHeadMobile());
        if (req.getHeadTelephone() != null) pq.setHeadTelephone(req.getHeadTelephone());
        if (req.getHeadEmail() != null) pq.setHeadEmail(req.getHeadEmail());
        if (req.getUniversityName() != null) pq.setUniversityName(req.getUniversityName());
        if (req.getUniversityCity() != null) pq.setUniversityCity(req.getUniversityCity());
        if (req.getUniversityState() != null) pq.setUniversityState(req.getUniversityState());
        if (req.getUniversityPinCode() != null) pq.setUniversityPinCode(req.getUniversityPinCode());
        if (req.getInstitutionType() != null) pq.setInstitutionType(req.getInstitutionType());
        if (req.getInstitutionTypeOther() != null) pq.setInstitutionTypeOther(req.getInstitutionTypeOther());
        if (req.getOwnershipStatus() != null) pq.setOwnershipStatus(req.getOwnershipStatus());
        if (req.getOwnershipStatusOther() != null) pq.setOwnershipStatusOther(req.getOwnershipStatusOther());
        if (req.getNumUGPrograms() != null) pq.setNumUGPrograms(req.getNumUGPrograms());
        if (req.getNumPGPrograms() != null) pq.setNumPGPrograms(req.getNumPGPrograms());
        if (req.getFacultyDepartmentName() != null) pq.setFacultyDepartmentName(req.getFacultyDepartmentName());
        if (req.getNumAlliedDepartments() != null) pq.setNumAlliedDepartments(req.getNumAlliedDepartments());
        if (req.getNumUGEnggPrograms() != null) pq.setNumUGEnggPrograms(req.getNumUGEnggPrograms());
        if (req.getNumPGEnggPrograms() != null) pq.setNumPGEnggPrograms(req.getNumPGEnggPrograms());
        if (req.getHodName() != null) pq.setHodName(req.getHodName());
        if (req.getHodAppointment() != null) pq.setHodAppointment(req.getHodAppointment());
        if (req.getHodQualification() != null) pq.setHodQualification(req.getHodQualification());
        if (req.getHodQualificationOther() != null) pq.setHodQualificationOther(req.getHodQualificationOther());

        // Update nested collections
        if (req.getProgramsOffered() != null) {
            pq.getProgramsOffered().clear();
            List<ProgramOffered> items = IntStream.range(0, req.getProgramsOffered().size())
                    .mapToObj(i -> {
                        var dto = req.getProgramsOffered().get(i);
                        return ProgramOffered.builder()
                                .preQualifier(pq).level(dto.getLevel()).name(dto.getName())
                                .yearOfStart(dto.getYearOfStart()).yearOfClose(dto.getYearOfClose())
                                .department(dto.getDepartment()).sortOrder(i).build();
                    }).collect(Collectors.toList());
            pq.getProgramsOffered().addAll(items);
        }

        if (req.getProgramsForAccreditation() != null) {
            pq.getProgramsForAccreditation().clear();
            List<ProgramForAccreditation> items = IntStream.range(0, req.getProgramsForAccreditation().size())
                    .mapToObj(i -> {
                        var dto = req.getProgramsForAccreditation().get(i);
                        return ProgramForAccreditation.builder()
                                .preQualifier(pq).department(dto.getDepartment())
                                .program(dto.getProgram()).sortOrder(i).build();
                    }).collect(Collectors.toList());
            pq.getProgramsForAccreditation().addAll(items);
        }

        if (req.getAlliedDepartments() != null) {
            pq.getAlliedDepartments().clear();
            List<AlliedDepartment> items = IntStream.range(0, req.getAlliedDepartments().size())
                    .mapToObj(i -> {
                        var dto = req.getAlliedDepartments().get(i);
                        return AlliedDepartment.builder()
                                .preQualifier(pq).department(dto.getDepartment())
                                .alliedDepartment(dto.getAlliedDepartment()).sortOrder(i).build();
                    }).collect(Collectors.toList());
            pq.getAlliedDepartments().addAll(items);
        }

        if (req.getComplianceStatus() != null) {
            pq.getComplianceStatus().clear();
            List<ComplianceRow> items = IntStream.range(0, req.getComplianceStatus().size())
                    .mapToObj(i -> {
                        var dto = req.getComplianceStatus().get(i);
                        return ComplianceRow.builder()
                                .preQualifier(pq).qualifier(dto.getQualifier())
                                .currentStatus(dto.getCurrentStatus())
                                .complianceStatus(dto.getComplianceStatus()).sortOrder(i).build();
                    }).collect(Collectors.toList());
            pq.getComplianceStatus().addAll(items);
        }

        // Update status
        if (pq.getStatus() == PreQualifierStatus.DRAFT) {
            pq.setStatus(PreQualifierStatus.IN_PROGRESS);
        }
        pq.setLastModified(LocalDateTime.now());

        pq = preQualifierRepository.save(pq);
        return mapToDetailResponse(pq);
    }

    @Transactional
    public PreQualifierDetailResponse submitPreQualifier(Long id) {
        PreQualifier pq = preQualifierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PreQualifier", "id", id));

        if (pq.getStatus() == PreQualifierStatus.SUBMITTED) {
            throw new BadRequestException("Pre-qualifier is already submitted");
        }

        pq.setStatus(PreQualifierStatus.SUBMITTED);
        pq.setSubmittedAt(LocalDateTime.now());
        pq.setLastModified(LocalDateTime.now());
        pq.setCompletionPercentage(100);

        pq = preQualifierRepository.save(pq);
        return mapToDetailResponse(pq);
    }

    @Transactional
    public void deletePreQualifier(Long id) {
        PreQualifier pq = preQualifierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PreQualifier", "id", id));

        if (pq.getStatus() == PreQualifierStatus.SUBMITTED) {
            throw new BadRequestException("Cannot delete a submitted pre-qualifier");
        }
        preQualifierRepository.delete(pq);
    }

    private PreQualifierResponse mapToResponse(PreQualifier pq) {
        return PreQualifierResponse.builder()
                .id(pq.getId())
                .institutionId(pq.getInstitution().getId())
                .institutionName(pq.getInstitution().getName())
                .status(pq.getStatus())
                .completionPercentage(pq.getCompletionPercentage())
                .lastModified(pq.getLastModified())
                .submittedAt(pq.getSubmittedAt())
                .programAppliedFor(pq.getProgramAppliedFor())
                .instituteName(pq.getInstituteName())
                .createdAt(pq.getCreatedAt())
                .build();
    }

    private PreQualifierDetailResponse mapToDetailResponse(PreQualifier pq) {
        return PreQualifierDetailResponse.builder()
                .id(pq.getId())
                .institutionId(pq.getInstitution().getId())
                .institutionName(pq.getInstitution().getName())
                .status(pq.getStatus())
                .completionPercentage(pq.getCompletionPercentage())
                .lastModified(pq.getLastModified())
                .submittedAt(pq.getSubmittedAt())
                .createdAt(pq.getCreatedAt())
                .programAppliedFor(pq.getProgramAppliedFor())
                .instituteName(pq.getInstituteName())
                .yearOfEstablishment(pq.getYearOfEstablishment())
                .location(pq.getLocation())
                .city(pq.getCity())
                .state(pq.getState())
                .pinCode(pq.getPinCode())
                .website(pq.getWebsite())
                .email(pq.getEmail())
                .phone(pq.getPhone())
                .headName(pq.getHeadName())
                .headDesignation(pq.getHeadDesignation())
                .headAppointmentStatus(pq.getHeadAppointmentStatus())
                .headMobile(pq.getHeadMobile())
                .headTelephone(pq.getHeadTelephone())
                .headEmail(pq.getHeadEmail())
                .universityName(pq.getUniversityName())
                .universityCity(pq.getUniversityCity())
                .universityState(pq.getUniversityState())
                .universityPinCode(pq.getUniversityPinCode())
                .institutionType(pq.getInstitutionType())
                .institutionTypeOther(pq.getInstitutionTypeOther())
                .ownershipStatus(pq.getOwnershipStatus())
                .ownershipStatusOther(pq.getOwnershipStatusOther())
                .numUGPrograms(pq.getNumUGPrograms())
                .numPGPrograms(pq.getNumPGPrograms())
                .facultyDepartmentName(pq.getFacultyDepartmentName())
                .numAlliedDepartments(pq.getNumAlliedDepartments())
                .numUGEnggPrograms(pq.getNumUGEnggPrograms())
                .numPGEnggPrograms(pq.getNumPGEnggPrograms())
                .hodName(pq.getHodName())
                .hodAppointment(pq.getHodAppointment())
                .hodQualification(pq.getHodQualification())
                .hodQualificationOther(pq.getHodQualificationOther())
                .build();
    }
}