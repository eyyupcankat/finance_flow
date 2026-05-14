package com.fintrack.backend.controller;

import com.fintrack.backend.dto.UserSettingsRequest;
import com.fintrack.backend.dto.UserSettingsResponse;
import com.fintrack.backend.security.UserPrincipal;
import com.fintrack.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/settings")
    public ResponseEntity<UserSettingsResponse> getSettings(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userService.getSettings(principal.getId()));
    }

    @PutMapping("/settings")
    public ResponseEntity<UserSettingsResponse> updateSettings(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UserSettingsRequest request) {
        return ResponseEntity.ok(userService.updateSettings(principal.getId(), request));
    }

    @PostMapping("/2fa/toggle")
    public ResponseEntity<?> toggleTwoFactor(@AuthenticationPrincipal UserPrincipal principal) {
        userService.toggleTwoFactor(principal.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody com.fintrack.backend.dto.ChangePasswordRequest request) {
        userService.changePassword(principal.getId(), request);
        return ResponseEntity.ok().build();
    }
}
