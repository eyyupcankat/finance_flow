package com.fintrack.backend.dto;

public record AuthResponse(
        String token,
        Long userId,
        String name,
        String email
) {}
