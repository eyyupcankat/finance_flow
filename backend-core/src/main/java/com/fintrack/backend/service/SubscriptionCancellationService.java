package com.fintrack.backend.service;

import com.fintrack.backend.dto.SubscriptionResponse;
import com.fintrack.backend.dto.mockbank.MockBankCancelRequest;
import com.fintrack.backend.dto.mockbank.MockBankCancelResponse;
import com.fintrack.backend.entity.Subscription;
import com.fintrack.backend.entity.SubscriptionStatus;
import com.fintrack.backend.exception.ResourceNotFoundException;
import com.fintrack.backend.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class SubscriptionCancellationService {

    private final WebClient mockBankWebClient;
    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionResponse cancelSubscription(Long subscriptionId, Long userId) {
        Subscription subscription = subscriptionRepository.findByIdAndUserId(subscriptionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));

        if (subscription.getStatus() == SubscriptionStatus.CANCELLED) {
            return SubscriptionResponse.from(subscription);
        }

        String cardNumber = subscription.getCard().getCardNumber();

        mockBankWebClient
                .post()
                .uri("/api/v1/bank/cards/{cardNumber}/cancel", cardNumber)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(new MockBankCancelRequest(subscription.getName()))
                .retrieve()
                .bodyToMono(MockBankCancelResponse.class)
                .block();

        subscription.setStatus(SubscriptionStatus.CANCELLED);
        return SubscriptionResponse.from(subscriptionRepository.save(subscription));
    }
}
