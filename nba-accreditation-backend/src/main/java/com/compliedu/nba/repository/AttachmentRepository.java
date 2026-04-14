package com.compliedu.nba.repository;

import com.compliedu.nba.entity.Attachment;
import com.compliedu.nba.entity.enums.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByEntityTypeAndEntityId(EntityType entityType, Long entityId);
}