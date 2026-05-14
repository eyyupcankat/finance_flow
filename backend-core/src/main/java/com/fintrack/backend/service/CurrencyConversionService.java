package com.fintrack.backend.service;

import com.fintrack.backend.dto.CurrencyApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class CurrencyConversionService {

    private final WebClient webClient;
    private final Map<String, BigDecimal> ratesCache = new ConcurrentHashMap<>();
    private long lastFetchTime = 0;
    private static final long CACHE_DURATION = 3600000; // 1 hour

    public CurrencyConversionService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://open.er-api.com/v6/latest").build();
    }

    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (amount == null || fromCurrency.equals(toCurrency)) {
            return amount;
        }

        // Clean currency codes (e.g., "USD ($)" -> "USD")
        String from = extractCode(fromCurrency);
        String to = extractCode(toCurrency);

        if (from.equals(to)) return amount;

        refreshRatesIfNeeded();

        if (ratesCache.isEmpty()) {
            log.warn("Rates cache is empty, returning original amount");
            return amount;
        }

        try {
            // Formula: amount * (toRate / fromRate)
            BigDecimal fromRate = ratesCache.getOrDefault(from, BigDecimal.ONE);
            BigDecimal toRate = ratesCache.getOrDefault(to, BigDecimal.ONE);

            return amount.multiply(toRate)
                    .divide(fromRate, 2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            log.error("Error converting currency from {} to {}: {}", from, to, e.getMessage());
            return amount;
        }
    }

    private String extractCode(String currency) {
        if (currency == null) return "USD";
        return currency.split(" ")[0].toUpperCase();
    }

    private void refreshRatesIfNeeded() {
        long now = System.currentTimeMillis();
        if (ratesCache.isEmpty() || (now - lastFetchTime) > CACHE_DURATION) {
            try {
                CurrencyApiResponse response = webClient.get()
                        .uri("/USD")
                        .retrieve()
                        .bodyToMono(CurrencyApiResponse.class)
                        .block();

                if (response != null && "success".equals(response.result())) {
                    ratesCache.clear();
                    ratesCache.putAll(response.rates());
                    lastFetchTime = now;
                    log.info("Currency rates updated successfully");
                }
            } catch (Exception e) {
                log.error("Failed to fetch currency rates: {}", e.getMessage());
            }
        }
    }
}
