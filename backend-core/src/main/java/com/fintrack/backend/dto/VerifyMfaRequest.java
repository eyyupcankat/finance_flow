package com.fintrack.backend.dto;

public record VerifyMfaRequest(
    Long userId,
    String code
) {}
