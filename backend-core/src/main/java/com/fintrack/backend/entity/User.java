package com.fintrack.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AuthProvider provider;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "password_hash")
    private String passwordHash;

    // Profile Info
    private String jobTitle;
    private String location;

    // App Preferences
    @Builder.Default
    @Column(name = "dark_mode", nullable = false, columnDefinition = "boolean default false")
    private Boolean darkMode = false;

    @Builder.Default
    @Column(name = "email_alerts", nullable = false, columnDefinition = "boolean default true")
    private Boolean emailAlerts = true;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "varchar(20) default 'USD ($)'")
    private String currency = "USD ($)";

    @Builder.Default
    @Column(name = "two_factor_enabled", nullable = false, columnDefinition = "boolean default false")
    private Boolean twoFactorEnabled = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VirtualCard> cards = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Subscription> subscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserCancellation> cancellations = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserSession> sessions = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
