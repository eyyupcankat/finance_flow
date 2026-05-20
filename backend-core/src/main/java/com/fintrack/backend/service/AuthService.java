package com.fintrack.backend.service;

import com.fintrack.backend.dto.AuthResponse;
import com.fintrack.backend.dto.LoginRequest;
import com.fintrack.backend.dto.RegisterRequest;
import com.fintrack.backend.entity.AuthProvider;
import com.fintrack.backend.entity.User;
import com.fintrack.backend.repository.UserRepository;
import com.fintrack.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserSessionService userSessionService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .provider(AuthProvider.LOCAL)
                .build();
        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        userSessionService.createSession(user.getId(), token);
        return new AuthResponse(
                token, 
                user.getId(), 
                user.getName(), 
                user.getEmail(),
                user.getJobTitle(),
                user.getLocation(),
                user.getDarkMode(),
                user.getEmailAlerts(),
                user.getCurrency(),
                user.getTwoFactorEnabled(),
                false // mfaRequired is false for registration
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        if (Boolean.TRUE.equals(user.getTwoFactorEnabled())) {
            // For now, we don't return a token and signal MFA is required
            return new AuthResponse(
                    null, 
                    user.getId(), 
                    user.getName(), 
                    user.getEmail(),
                    user.getJobTitle(),
                    user.getLocation(),
                    user.getDarkMode(),
                    user.getEmailAlerts(),
                    user.getCurrency(),
                    true, // twoFactorEnabled
                    true  // mfaRequired
            );
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        userSessionService.createSession(user.getId(), token);
        return new AuthResponse(
                token, 
                user.getId(), 
                user.getName(), 
                user.getEmail(),
                user.getJobTitle(),
                user.getLocation(),
                user.getDarkMode(),
                user.getEmailAlerts(),
                user.getCurrency(),
                false, // twoFactorEnabled (or the actual value, but if we are here it's false or we skipped it)
                false  // mfaRequired
        );
    }

    public AuthResponse verifyMfa(com.fintrack.backend.dto.VerifyMfaRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // In a real app, we would check a TOTP code or a code sent via email/SMS.
        // For demonstration, we use a mock code: 123456
        if (!"123456".equals(request.code())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid verification code");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        userSessionService.createSession(user.getId(), token);
        return new AuthResponse(
                token, 
                user.getId(), 
                user.getName(), 
                user.getEmail(),
                user.getJobTitle(),
                user.getLocation(),
                user.getDarkMode(),
                user.getEmailAlerts(),
                user.getCurrency(),
                true, // twoFactorEnabled
                false // mfaRequired is now false
        );
    }
}
