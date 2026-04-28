package com.fintrack.mockbank.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        Long id,
        String cardNumber,
        String merchant,
        String description,
        BigDecimal amount,
        String currency,
        LocalDate transactionDate,
        String category,
        boolean isRecurring
) {}
