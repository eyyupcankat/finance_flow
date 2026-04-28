package com.fintrack.mockbank.repository;

import com.fintrack.mockbank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCardNumber(String cardNumber);
    boolean existsByCardNumber(String cardNumber);
}
