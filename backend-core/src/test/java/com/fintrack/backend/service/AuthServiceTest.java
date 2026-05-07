package com.fintrack.backend.service;

import com.fintrack.backend.dto.AuthResponse;
import com.fintrack.backend.dto.LoginRequest;
import com.fintrack.backend.dto.RegisterRequest;
import com.fintrack.backend.entity.AuthProvider;
import com.fintrack.backend.entity.User;
import com.fintrack.backend.repository.UserRepository;
import com.fintrack.backend.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtUtil jwtUtil;

    @InjectMocks AuthService authService;

    private User buildUser(Long id, String email) {
        return User.builder()
                .id(id).email(email).name("Test User")
                .passwordHash("hashed_password")
                .provider(AuthProvider.LOCAL)
                .build();
    }

    @Test
    void register_newUser_returnsTokenAndUserInfo() {
        RegisterRequest req = new RegisterRequest("Test User", "test@example.com", "password123");
        User saved = buildUser(1L, "test@example.com");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password");
        when(userRepository.save(any())).thenReturn(saved);
        when(jwtUtil.generateToken(1L, "test@example.com")).thenReturn("jwt-token");

        AuthResponse response = authService.register(req);

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.email()).isEqualTo("test@example.com");
        assertThat(response.userId()).isEqualTo(1L);
    }

    @Test
    void register_emailAlreadyExists_throwsConflict() {
        RegisterRequest req = new RegisterRequest("Test", "existing@example.com", "pass123");
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.CONFLICT));
    }

    @Test
    void login_validCredentials_returnsToken() {
        LoginRequest req = new LoginRequest("test@example.com", "password123");
        User user = buildUser(1L, "test@example.com");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(jwtUtil.generateToken(1L, "test@example.com")).thenReturn("jwt-token");

        AuthResponse response = authService.login(req);

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.email()).isEqualTo("test@example.com");
    }

    @Test
    void login_userNotFound_throwsUnauthorized() {
        LoginRequest req = new LoginRequest("nobody@example.com", "pass");
        when(userRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.UNAUTHORIZED));
    }

    @Test
    void login_wrongPassword_throwsUnauthorized() {
        LoginRequest req = new LoginRequest("test@example.com", "wrongpass");
        User user = buildUser(1L, "test@example.com");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpass", "hashed_password")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.UNAUTHORIZED));
    }
}
