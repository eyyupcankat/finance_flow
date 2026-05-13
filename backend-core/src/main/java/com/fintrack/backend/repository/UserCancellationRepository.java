package com.fintrack.backend.repository;

import com.fintrack.backend.entity.UserCancellation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCancellationRepository extends JpaRepository<UserCancellation, Long> {
    boolean existsByUserIdAndMerchantName(Long userId, String merchantName);
    Optional<UserCancellation> findByUserIdAndMerchantName(Long userId, String merchantName);
}
