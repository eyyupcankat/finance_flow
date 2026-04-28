package com.fintrack.mockbank.dto;

import java.time.LocalDateTime;

public record CancelResponse(
        boolean success,
        String message,
        String cardNumber,
        String serviceName,
        LocalDateTime cancelledAt
) {}
