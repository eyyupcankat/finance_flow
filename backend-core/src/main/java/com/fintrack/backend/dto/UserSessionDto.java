package com.fintrack.backend.dto;

public record UserSessionDto(
    Long id,
    String device,
    String location,
    String time,
    boolean current
) {}
