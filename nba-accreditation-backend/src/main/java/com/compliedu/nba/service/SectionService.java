package com.compliedu.nba.service;

import com.compliedu.nba.dto.request.UpdateSectionRequest;
import com.compliedu.nba.dto.request.UpdateSubSectionRequest;
import com.compliedu.nba.dto.response.SectionResponse;
import com.compliedu.nba.dto.response.SubSectionResponse;
import com.compliedu.nba.dto.response.AttachmentResponse;
import com.compliedu.nba.entity.Criteria;
import com.compliedu.nba.entity.SectionData;
import com.compliedu.nba.entity.SubSectionData;
import com.compliedu.nba.entity.enums.EntityType;
import com.compliedu.nba.exception.ResourceNotFoundException;
import com.compliedu.nba.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SectionService {

    private final CriteriaRepository criteriaRepository;
    private final SectionDataRepository sectionRepository;
    private final SubSectionDataRepository subSectionRepository;
    private final AttachmentRepository attachmentRepository;

    public List<com.compliedu.nba.dto.response.CriteriaResponse> listCriteria(Long sarId) {
        return criteriaRepository.findBySarApplicationIdOrderByCriteriaNumberAsc(sarId)
                .stream().map(c -> com.compliedu.nba.dto.response.CriteriaResponse.builder()
                        .id(c.getId())
                        .criteriaNumber(c.getCriteriaNumber())
                        .title(c.getTitle())
                        .description(c.getDescription())
                        .maxMarks(c.getMaxMarks())
                        .completedSections(c.getCompletedSections())
                        .totalSections(c.getSections().size())
                        .totalMarks(c.getTotalMarks())
                        .obtainedMarks(c.getObtainedMarks())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public SectionResponse updateSection(Long sarId, Long criteriaId, Long sectionId, UpdateSectionRequest request) {
        SectionData section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", sectionId));

        if (request.getContent() != null) section.setContent(request.getContent());
        if (request.getInstituteMarks() != null) section.setInstituteMarks(request.getInstituteMarks());
        if (request.getIsCompleted() != null) section.setIsCompleted(request.getIsCompleted());
        section.setLastModified(LocalDateTime.now());

        section = sectionRepository.save(section);

        // Update criteria completed count
        updateCriteriaStats(section.getCriteria());

        List<AttachmentResponse> attachments = attachmentRepository
                .findByEntityTypeAndEntityId(EntityType.SECTION, section.getId())
                .stream().map(a -> AttachmentResponse.builder()
                        .id(a.getId()).fileName(a.getFileName()).fileType(a.getFileType())
                        .fileSize(a.getFileSize()).downloadUrl("/api/v1/attachments/" + a.getId())
                        .uploadedAt(a.getUploadedAt()).build())
                .collect(Collectors.toList());

        List<SubSectionResponse> subSections = section.getSubSections().stream()
                .map(sub -> SubSectionResponse.builder()
                        .id(sub.getId()).subSectionNumber(sub.getSubSectionNumber())
                        .title(sub.getTitle()).maxMarks(sub.getMaxMarks())
                        .instituteMarks(sub.getInstituteMarks()).content(sub.getContent())
                        .isCompleted(sub.getIsCompleted()).lastModified(sub.getLastModified())
                        .build())
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

    @Transactional
    public SubSectionResponse updateSubSection(Long sarId, Long criteriaId, Long sectionId,
                                                Long subSectionId, UpdateSubSectionRequest request) {
        SubSectionData sub = subSectionRepository.findById(subSectionId)
                .orElseThrow(() -> new ResourceNotFoundException("SubSection", "id", subSectionId));

        if (request.getContent() != null) sub.setContent(request.getContent());
        if (request.getInstituteMarks() != null) sub.setInstituteMarks(request.getInstituteMarks());
        if (request.getIsCompleted() != null) sub.setIsCompleted(request.getIsCompleted());
        sub.setLastModified(LocalDateTime.now());

        sub = subSectionRepository.save(sub);

        List<AttachmentResponse> attachments = attachmentRepository
                .findByEntityTypeAndEntityId(EntityType.SUB_SECTION, sub.getId())
                .stream().map(a -> AttachmentResponse.builder()
                        .id(a.getId()).fileName(a.getFileName()).fileType(a.getFileType())
                        .fileSize(a.getFileSize()).downloadUrl("/api/v1/attachments/" + a.getId())
                        .uploadedAt(a.getUploadedAt()).build())
                .collect(Collectors.toList());

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

    private void updateCriteriaStats(Criteria criteria) {
        long completed = criteria.getSections().stream().filter(SectionData::getIsCompleted).count();
        criteria.setCompletedSections((int) completed);

        var totalObtained = criteria.getSections().stream()
                .map(SectionData::getInstituteMarks)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        criteria.setObtainedMarks(totalObtained);

        criteriaRepository.save(criteria);
    }
}