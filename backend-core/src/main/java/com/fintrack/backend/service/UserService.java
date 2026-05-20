package com.fintrack.backend.service;

import com.fintrack.backend.dto.ChangePasswordRequest;
import com.fintrack.backend.dto.UserSettingsRequest;
import com.fintrack.backend.dto.UserSettingsResponse;
import com.fintrack.backend.entity.User;
import com.fintrack.backend.exception.ResourceNotFoundException;
import com.fintrack.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserSettingsResponse getSettings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "User not found"));
        return UserSettingsResponse.from(user);
    }

    @Transactional
    public UserSettingsResponse updateSettings(Long userId, UserSettingsRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "User not found"));

        user.setName(request.name());
        user.setEmail(request.email());
        user.setJobTitle(request.jobTitle());
        user.setLocation(request.location());
        user.setDarkMode(request.darkMode());
        user.setEmailAlerts(request.emailAlerts());
        user.setCurrency(request.currency());
        user.setTwoFactorEnabled(request.twoFactorEnabled());

        return UserSettingsResponse.from(userRepository.save(user));
    }

    @Transactional
    public void toggleTwoFactor(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "User not found"));
        user.setTwoFactorEnabled(!user.getTwoFactorEnabled());
        userRepository.save(user);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "User not found"));

        if (user.getPasswordHash() == null) {
            throw new IllegalArgumentException("OAuth2 users cannot change passwords directly.");
        }

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect current password.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "User not found"));
        userRepository.delete(user);
    }
}
