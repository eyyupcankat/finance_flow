package com.fintrack.mockbank.repository;

import com.fintrack.mockbank.entity.CancellationRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CancellationRepository extends JpaRepository<CancellationRecord, Long> {
    List<CancellationRecord> findByCardNumber(String cardNumber);
}
