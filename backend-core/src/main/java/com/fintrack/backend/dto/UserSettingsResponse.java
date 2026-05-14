package com.fintrack.backend.dto;

import com.fintrack.backend.entity.User;

public record UserSettingsResponse(
        Long id,
        String name,
        String email,
        String jobTitle,
        String location,
        boolean darkMode,
        boolean emailAlerts,
        String currency
) {
    public static UserSettingsResponse from(User user) {
        return new UserSettingsResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getJobTitle(),
                user.getLocation(),
                user.getDarkMode(),
                user.getEmailAlerts(),
                user.getCurrency()
        );
    }
}
