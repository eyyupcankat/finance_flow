package com.fintrack.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CardRequest(
        @NotBlank @Size(min = 16, max = 19) String cardNumber,
        @NotBlank @Size(max = 50) String label
) {}
