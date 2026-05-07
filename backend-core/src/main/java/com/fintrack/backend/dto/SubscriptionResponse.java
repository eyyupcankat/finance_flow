package com.fintrack.backend.dto;

import com.fintrack.backend.entity.Subscription;
import com.fintrack.backend.entity.SubscriptionStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SubscriptionResponse(
        Long id,
        String name,
        BigDecimal amount,
        String currency,
        String billingCycle,
        LocalDateTime detectedAt,
        SubscriptionStatus status,
        Long cardId
) {
    public static SubscriptionResponse from(Subscription s) {
        return new SubscriptionResponse(
                s.getId(), s.getName(), s.getAmount(), s.getCurrency(),
                s.getBillingCycle(), s.getDetectedAt(), s.getStatus(), s.getCard().getId()
        );
    }
}
