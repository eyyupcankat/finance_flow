package com.fintrack.backend.dto;

public record UserSettingsRequest(
        String name,
        String email,
        String jobTitle,
        String location,
        boolean darkMode,
        boolean emailAlerts,
        boolean desktopNotify,
        String currency
) {}
