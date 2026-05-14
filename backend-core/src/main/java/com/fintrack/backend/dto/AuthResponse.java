package com.fintrack.backend.dto;

public record AuthResponse(
        String token,
        Long userId,
        String name,
        String email,
        String jobTitle,
        String location,
        boolean darkMode,
        boolean emailAlerts,
        String currency
) {}
