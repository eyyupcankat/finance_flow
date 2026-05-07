package com.fintrack.backend.dto.mockbank;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MockBankTransactionDto(
        Long id,
        String cardNumber,
        String merchant,
        String description,
        BigDecimal amount,
        String currency,
        LocalDate date,
        String category,
        boolean recurring
) {}
