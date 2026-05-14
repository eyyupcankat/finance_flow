package com.fintrack.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.Map;

public record CurrencyApiResponse(
    String result,
    @JsonProperty("base_code") String baseCode,
    @JsonProperty("rates") Map<String, BigDecimal> rates
) {}
