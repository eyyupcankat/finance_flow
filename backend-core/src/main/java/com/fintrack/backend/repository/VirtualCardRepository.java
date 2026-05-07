package com.fintrack.backend.repository;

import com.fintrack.backend.entity.VirtualCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VirtualCardRepository extends JpaRepository<VirtualCard, Long> {
    List<VirtualCard> findByUserId(Long userId);
    Optional<VirtualCard> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndCardNumber(Long userId, String cardNumber);
}
