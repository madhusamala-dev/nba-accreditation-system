package com.compliedu.nba.repository;

import com.compliedu.nba.entity.User;
import com.compliedu.nba.entity.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByResetToken(String resetToken);

    List<User> findByRole(UserRole role);

    List<User> findByInstitutionId(Long institutionId);

    @Query("SELECT u FROM User u WHERE " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:search IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findAllWithFilters(@Param("role") UserRole role,
                                  @Param("search") String search,
                                  Pageable pageable);

    long countByRole(UserRole role);

    long countByIsActiveTrue();
}