package com.fintrack.backend.repository;

import com.fintrack.backend.entity.Subscription;
import com.fintrack.backend.entity.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserId(Long userId);
    List<Subscription> findByCardId(Long cardId);
    List<Subscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);
    Optional<Subscription> findByIdAndUserId(Long id, Long userId);
    boolean existsByCardIdAndName(Long cardId, String name);
}
