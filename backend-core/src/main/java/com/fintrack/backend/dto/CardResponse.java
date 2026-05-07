package com.fintrack.backend.dto;

import com.fintrack.backend.entity.VirtualCard;

import java.time.LocalDateTime;

public record CardResponse(
        Long id,
        String cardNumber,
        String label,
        LocalDateTime addedAt
) {
    public static CardResponse from(VirtualCard card) {
        return new CardResponse(card.getId(), card.getCardNumber(), card.getLabel(), card.getAddedAt());
    }
}
