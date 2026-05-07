package com.fintrack.backend.dto.mockbank;

import java.time.LocalDateTime;

public record MockBankCancelResponse(
        boolean success,
        String message,
        String cardNumber,
        String serviceName,
        LocalDateTime cancelledAt
) {}
