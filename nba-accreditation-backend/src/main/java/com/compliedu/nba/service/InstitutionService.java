package com.compliedu.nba.service;

import com.compliedu.nba.dto.request.CreateInstitutionRequest;
import com.compliedu.nba.dto.response.InstitutionResponse;
import com.compliedu.nba.entity.Institution;
import com.compliedu.nba.entity.enums.AccreditationStatus;
import com.compliedu.nba.exception.ResourceNotFoundException;
import com.compliedu.nba.repository.InstitutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InstitutionService {

    private final InstitutionRepository institutionRepository;

    public Page<InstitutionResponse> listInstitutions(AccreditationStatus status, String search, Pageable pageable) {
        return institutionRepository.findAllWithFilters(status, search, pageable)
                .map(this::mapToResponse);
    }

    public InstitutionResponse getInstitutionById(Long id) {
        Institution inst = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));
        return mapToResponse(inst);
    }

    @Transactional
    public InstitutionResponse createInstitution(CreateInstitutionRequest request) {
        Institution inst = Institution.builder()
                .name(request.getName())
                .address(request.getAddress())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .establishedYear(request.getEstablishedYear())
                .website(request.getWebsite())
                .city(request.getCity())
                .state(request.getState())
                .pinCode(request.getPinCode())
                .build();
        inst = institutionRepository.save(inst);
        return mapToResponse(inst);
    }

    @Transactional
    public InstitutionResponse updateInstitution(Long id, CreateInstitutionRequest request) {
        Institution inst = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));

        inst.setName(request.getName());
        inst.setAddress(request.getAddress());
        inst.setContactEmail(request.getContactEmail());
        inst.setContactPhone(request.getContactPhone());
        inst.setEstablishedYear(request.getEstablishedYear());
        inst.setWebsite(request.getWebsite());
        inst.setCity(request.getCity());
        inst.setState(request.getState());
        inst.setPinCode(request.getPinCode());

        inst = institutionRepository.save(inst);
        return mapToResponse(inst);
    }

    @Transactional
    public void deleteInstitution(Long id) {
        if (!institutionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Institution", "id", id);
        }
        institutionRepository.deleteById(id);
    }

    public InstitutionResponse mapToResponse(Institution inst) {
        return InstitutionResponse.builder()
                .id(inst.getId())
                .name(inst.getName())
                .address(inst.getAddress())
                .contactEmail(inst.getContactEmail())
                .contactPhone(inst.getContactPhone())
                .establishedYear(inst.getEstablishedYear())
                .accreditationStatus(inst.getAccreditationStatus())
                .website(inst.getWebsite())
                .city(inst.getCity())
                .state(inst.getState())
                .pinCode(inst.getPinCode())
                .createdAt(inst.getCreatedAt())
                .updatedAt(inst.getUpdatedAt())
                .build();
    }
}