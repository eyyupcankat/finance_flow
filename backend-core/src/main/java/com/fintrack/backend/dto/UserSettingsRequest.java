package com.fintrack.backend.dto;

public record UserSettingsRequest(
        String name,
        String email,
        String jobTitle,
        String location,
        boolean darkMode,
        boolean emailAlerts,
        String currency,
        boolean twoFactorEnabled
) {}
