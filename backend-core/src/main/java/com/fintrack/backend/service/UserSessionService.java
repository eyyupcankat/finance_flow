package com.fintrack.backend.service;

import com.fintrack.backend.entity.User;
import com.fintrack.backend.entity.UserSession;
import com.fintrack.backend.repository.UserRepository;
import com.fintrack.backend.repository.UserSessionRepository;
import com.fintrack.backend.dto.UserSessionDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserSessionService {

    private final UserSessionRepository userSessionRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createSession(Long userId, String token) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        String device = "Unknown Device";
        String location = "San Francisco";

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String userAgent = request.getHeader("User-Agent");
            device = getDeviceFromUserAgent(userAgent);
            location = getLocationFromRequest(request);
        }

        UserSession session = UserSession.builder()
                .user(user)
                .token(token)
                .device(device)
                .location(location)
                .lastActiveAt(LocalDateTime.now())
                .build();

        userSessionRepository.save(session);
    }

    public List<UserSessionDto> getActiveSessions(Long userId) {
        List<UserSession> sessions = userSessionRepository.findByUserId(userId);
        
        String currentToken = null;
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String header = request.getHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                currentToken = header.substring(7);
            }
        }
        
        final String finalCurrentToken = currentToken;
        return sessions.stream().map(session -> {
            boolean isCurrent = finalCurrentToken != null && finalCurrentToken.equals(session.getToken());
            String timeStr = isCurrent ? "Active now" : getRelativeTimeString(session.getLastActiveAt());
            return new UserSessionDto(
                session.getId(),
                session.getDevice(),
                session.getLocation(),
                timeStr,
                isCurrent
            );
        }).toList();
    }

    private String getRelativeTimeString(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "Unknown";
        }
        java.time.Duration duration = java.time.Duration.between(dateTime, LocalDateTime.now());
        long seconds = duration.getSeconds();
        if (seconds < 60) {
            return "Active now";
        }
        long minutes = duration.toMinutes();
        if (minutes < 60) {
            return minutes + "m ago";
        }
        long hours = duration.toHours();
        if (hours < 24) {
            return hours + "h ago";
        }
        long days = duration.toDays();
        return days + "d ago";
    }

    public boolean isSessionActive(String token) {
        return userSessionRepository.existsByToken(token);
    }

    @Transactional
    public void logoutAllDevices(Long userId) {
        userSessionRepository.deleteByUserId(userId);
    }

    @Transactional
    public void deleteSession(String token) {
        userSessionRepository.findByToken(token).ifPresent(userSessionRepository::delete);
    }

    private String getDeviceFromUserAgent(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return "Unknown Device";
        }
        String ua = userAgent.toLowerCase();
        if (ua.contains("macintosh") || ua.contains("mac os x")) {
            if (ua.contains("iphone")) {
                return "iPhone";
            }
            if (ua.contains("ipad")) {
                return "iPad";
            }
            return "MacBook Pro";
        } else if (ua.contains("windows")) {
            return "Windows PC";
        } else if (ua.contains("android")) {
            return "Android Device";
        } else if (ua.contains("linux")) {
            return "Linux PC";
        }
        return "Web Browser";
    }

    private String getLocationFromRequest(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if ("127.0.0.1".equals(ip) || "0:0:0:0:0:0:0:1".equals(ip) || "localhost".equals(ip)) {
            return "San Francisco (Localhost)";
        }
        return "San Francisco";
    }
}
