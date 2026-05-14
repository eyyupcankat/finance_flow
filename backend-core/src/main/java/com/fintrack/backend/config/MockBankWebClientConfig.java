package com.fintrack.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class MockBankWebClientConfig {

    @Value("${mock.bank.api.url}")
    private String mockBankApiUrl;

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    public WebClient mockBankWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl(mockBankApiUrl)
                .build();
    }
}
