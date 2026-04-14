package com.compliedu.nba.service;

import com.compliedu.nba.dto.request.CreateSarApplicationRequest;
import com.compliedu.nba.dto.request.UpdateSarApplicationRequest;
import com.compliedu.nba.dto.response.*;
import com.compliedu.nba.entity.*;
import com.compliedu.nba.entity.enums.EntityType;
import com.compliedu.nba.entity.enums.SarStatus;
import com.compliedu.nba.exception.BadRequestException;
import com.compliedu.nba.exception.ResourceNotFoundException;
import com.compliedu.nba.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SarApplicationService {

    private final SarApplicationRepository sarRepository;
    private final InstitutionRepository institutionRepository;
    private final CriteriaRepository criteriaRepository;
    private final AttachmentRepository attachmentRepository;

    public Page<SarApplicationResponse> listSarApplications(SarStatus status, Long institutionId,
                                                             String departmentName, Pageable pageable) {
        return sarRepository.findAllWithFilters(status, institutionId, departmentName, pageable)
                .map(this::mapToResponse);
    }

    public SarApplicationDetailResponse getSarApplicationById(Long id) {
        SarApplication sar = sarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SAR Application", "id", id));

        List<CriteriaDetailResponse> criteriaDetails = sar.getCriteria().stream()
                .map(this::mapCriteriaToDetail)
                .collect(Collectors.toList());

        return SarApplicationDetailResponse.builder()
                .application(mapToResponse(sar))
                .criteria(criteriaDetails)
                .build();
    }

    @Transactional
    public SarApplicationResponse createSarApplication(CreateSarApplicationRequest request) {
        Institution institution = institutionRepository.findById(request.getInstitutionId())
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", request.getInstitutionId()));

        String appId = "SAR-" + institution.getName().replaceAll("\\s+", "").substring(0, Math.min(institution.getName().length(), 10)).toUpperCase()
                + "-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));

        SarApplication sar = SarApplication.builder()
                .applicationId(appId)
                .institution(institution)
                .departmentName(request.getDepartmentName())
                .applicationStartDate(request.getApplicationStartDate() != null ? request.getApplicationStartDate() : LocalDateTime.now())
                .applicationEndDate(request.getApplicationEndDate())
                .lastModified(LocalDateTime.now())
                .build();

        sar = sarRepository.save(sar);
        createDefaultCriteria(sar);
        sar = sarRepository.findById(sar.getId()).orElseThrow();

        return mapToResponse(sar);
    }

    @Transactional
    public SarApplicationResponse updateSarApplication(Long id, UpdateSarApplicationRequest request) {
        SarApplication sar = sarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SAR Application", "id", id));

        if (request.getDepartmentName() != null) sar.setDepartmentName(request.getDepartmentName());
        if (request.getApplicationEndDate() != null) sar.setApplicationEndDate(request.getApplicationEndDate());
        if (request.getStatus() != null) {
            SarStatus newStatus = SarStatus.valueOf(request.getStatus());
            sar.setStatus(newStatus);
        }
        sar.setLastModified(LocalDateTime.now());

        sar = sarRepository.save(sar);
        return mapToResponse(sar);
    }

    @Transactional
    public SarApplicationResponse submitSarApplication(Long id) {
        SarApplication sar = sarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SAR Application", "id", id));

        sar.setStatus(SarStatus.SUBMITTED);
        sar.setSubmittedAt(LocalDateTime.now());
        sar.setLastModified(LocalDateTime.now());

        sar = sarRepository.save(sar);
        return mapToResponse(sar);
    }

    @Transactional
    public void deleteSarApplication(Long id) {
        SarApplication sar = sarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SAR Application", "id", id));
        if (sar.getStatus() != SarStatus.DRAFT) {
            throw new BadRequestException("Only draft SAR applications can be deleted");
        }
        sarRepository.delete(sar);
    }

    private void createDefaultCriteria(SarApplication sar) {
        String[][] defaultCriteria = {
                {"1", "Vision, Mission and Program Educational Objectives", "60"},
                {"2", "Program Curriculum and Teaching-Learning Processes", "120"},
                {"3", "Course Outcomes and Program Outcomes", "120"},
                {"4", "Students' Performance", "120"},
                {"5", "Faculty Information and Contributions", "130"},
                {"6", "Facilities and Technical Support", "50"},
                {"7", "Continuous Improvement", "100"}
        };

        BigDecimal totalMax = BigDecimal.ZERO;
        for (String[] c : defaultCriteria) {
            BigDecimal maxMarks = new BigDecimal(c[2]);
            Criteria criteria = Criteria.builder()
                    .sarApplication(sar)
                    .criteriaNumber(Integer.parseInt(c[0]))
                    .title(c[1])
                    .maxMarks(maxMarks)
                    .totalMarks(maxMarks)
                    .build();
            criteriaRepository.save(criteria);
            totalMax = totalMax.add(maxMarks);
        }

        sar.setMaxOverallMarks(totalMax);
        sarRepository.save(sar);
    }

    private SarApplicationResponse mapToResponse(SarApplication sar) {
        return SarApplicationResponse.builder()
                .id(sar.getId())
                .applicationId(sar.getApplicationId())
                .institutionId(sar.getInstitution().getId())
                .institutionName(sar.getInstitution().getName())
                .departmentName(sar.getDepartmentName())
                .applicationStartDate(sar.getApplicationStartDate())
                .applicationEndDate(sar.getApplicationEndDate())
                .status(sar.getStatus())
                .completionPercentage(sar.getCompletionPercentage())
                .overallMarks(sar.getOverallMarks())
                .maxOverallMarks(sar.getMaxOverallMarks())
                .lastModified(sar.getLastModified())
                .submittedAt(sar.getSubmittedAt())
                .reviewedAt(sar.getReviewedAt())
                .approvedAt(sar.getApprovedAt())
                .createdAt(sar.getCreatedAt())
                .build();
    }

    private CriteriaDetailResponse mapCriteriaToDetail(Criteria criteria) {
        List<SectionResponse> sections = criteria.getSections().stream()
                .map(this::mapSectionToResponse)
                .collect(Collectors.toList());

        return CriteriaDetailResponse.builder()
                .id(criteria.getId())
                .criteriaNumber(criteria.getCriteriaNumber())
                .title(criteria.getTitle())
                .description(criteria.getDescription())
                .maxMarks(criteria.getMaxMarks())
                .completedSections(criteria.getCompletedSections())
                .totalSections(criteria.getSections().size())
                .totalMarks(criteria.getTotalMarks())
                .obtainedMarks(criteria.getObtainedMarks())
                .sections(sections)
                .build();
    }

    private SectionResponse mapSectionToResponse(SectionData section) {
        List<AttachmentResponse> attachments = attachmentRepository
                .findByEntityTypeAndEntityId(EntityType.SECTION, section.getId())
                .stream().map(this::mapAttachment).collect(Collectors.toList());

        List<SubSectionResponse> subSections = section.getSubSections().stream()
                .map(this::mapSubSectionToResponse)
                .collect(Collectors.toList());

        return SectionResponse.builder()
                .id(section.getId())
                .sectionNumber(section.getSectionNumber())
                .title(section.getTitle())
                .maxMarks(section.getMaxMarks())
                .instituteMarks(section.getInstituteMarks())
                .content(section.getContent())
                .attachments(attachments)
                .isCompleted(section.getIsCompleted())
                .lastModified(section.getLastModified())
                .subSections(subSections)
                .build();
    }

    private SubSectionResponse mapSubSectionToResponse(SubSectionData sub) {
        List<AttachmentResponse> attachments = attachmentRepository
                .findByEntityTypeAndEntityId(EntityType.SUB_SECTION, sub.getId())
                .stream().map(this::mapAttachment).collect(Collectors.toList());

        return SubSectionResponse.builder()
                .id(sub.getId())
                .subSectionNumber(sub.getSubSectionNumber())
                .title(sub.getTitle())
                .maxMarks(sub.getMaxMarks())
                .instituteMarks(sub.getInstituteMarks())
                .content(sub.getContent())
                .attachments(attachments)
                .isCompleted(sub.getIsCompleted())
                .lastModified(sub.getLastModified())
                .build();
    }

    private AttachmentResponse mapAttachment(Attachment att) {
        return AttachmentResponse.builder()
                .id(att.getId())
                .fileName(att.getFileName())
                .fileType(att.getFileType())
                .fileSize(att.getFileSize())
                .downloadUrl("/api/v1/attachments/" + att.getId())
                .uploadedAt(att.getUploadedAt())
                .build();
    }
}