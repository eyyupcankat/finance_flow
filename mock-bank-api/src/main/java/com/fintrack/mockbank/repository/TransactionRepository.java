package com.fintrack.mockbank.repository;

import com.fintrack.mockbank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCardNumber(String cardNumber);
    boolean existsByCardNumber(String cardNumber);

    @Query("SELECT t FROM Transaction t WHERE t.cardNumber = :cardNumber " +
           "AND NOT EXISTS (SELECT c FROM CancellationRecord c " +
           "WHERE c.cardNumber = t.cardNumber AND c.serviceName = t.merchant)")
    List<Transaction> findActiveByCardNumber(@Param("cardNumber") String cardNumber);
}
