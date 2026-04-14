package com.compliedu.nba.entity;

import com.compliedu.nba.entity.enums.AccreditationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "institutions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Institution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "established_year")
    private Integer establishedYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "accreditation_status", nullable = false)
    @Builder.Default
    private AccreditationStatus accreditationStatus = AccreditationStatus.PENDING;

    @Column(length = 500)
    private String website;

    @Column(length = 200)
    private String city;

    @Column(length = 200)
    private String state;

    @Column(name = "pin_code", length = 20)
    private String pinCode;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}