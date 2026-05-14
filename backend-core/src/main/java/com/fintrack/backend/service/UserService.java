package com.fintrack.backend.service;

import com.fintrack.backend.dto.UserSettingsRequest;
import com.fintrack.backend.dto.UserSettingsResponse;
import com.fintrack.backend.entity.User;
import com.fintrack.backend.exception.ResourceNotFoundException;
import com.fintrack.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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

        return UserSettingsResponse.from(userRepository.save(user));
    }
}
