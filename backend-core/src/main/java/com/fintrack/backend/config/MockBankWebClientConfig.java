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
    public WebClient mockBankWebClient() {
        return WebClient.builder()
                .baseUrl(mockBankApiUrl)
                .build();
    }
}
