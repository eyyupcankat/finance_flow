package com.fintrack.backend.repository;

import com.fintrack.backend.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    List<UserSession> findByUserId(Long userId);
    Optional<UserSession> findByToken(String token);
    boolean existsByToken(String token);
    void deleteByUserId(Long userId);
}
