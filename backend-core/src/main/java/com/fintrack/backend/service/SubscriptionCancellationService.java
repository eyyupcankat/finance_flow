package com.fintrack.backend.service;

import com.fintrack.backend.dto.SubscriptionResponse;
import com.fintrack.backend.dto.mockbank.MockBankCancelRequest;
import com.fintrack.backend.dto.mockbank.MockBankCancelResponse;
import com.fintrack.backend.entity.Subscription;
import com.fintrack.backend.entity.SubscriptionStatus;
import com.fintrack.backend.exception.ResourceNotFoundException;
import com.fintrack.backend.repository.SubscriptionRepository;
import com.fintrack.backend.repository.UserCancellationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class SubscriptionCancellationService {

    private final WebClient mockBankWebClient;
    private final SubscriptionRepository subscriptionRepository;
    private final UserCancellationRepository userCancellationRepository;
    private final CurrencyConversionService currencyService;

    public SubscriptionResponse cancelSubscription(Long subscriptionId, Long userId) {
        Subscription subscription = subscriptionRepository.findByIdAndUserId(subscriptionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("SUBSCRIPTION_NOT_FOUND", "Subscription not found"));

        String targetCurrency = subscription.getUser().getCurrency();

        if (subscription.getStatus() == SubscriptionStatus.CANCELLED) {
            return convertToResponse(subscription, targetCurrency);
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

        // Persist cancellation for this user/merchant even if card is re-linked
        if (!userCancellationRepository.existsByUserIdAndMerchantName(userId, subscription.getName())) {
            userCancellationRepository.save(com.fintrack.backend.entity.UserCancellation.builder()
                    .user(subscription.getUser())
                    .merchantName(subscription.getName())
                    .build());
        }

        subscription.setStatus(SubscriptionStatus.CANCELLED);
        return convertToResponse(subscriptionRepository.save(subscription), targetCurrency);
    }

    private SubscriptionResponse convertToResponse(Subscription s, String targetCurrency) {
        return new SubscriptionResponse(
                s.getId(), s.getName(),
                currencyService.convert(s.getAmount(), s.getCurrency(), targetCurrency),
                targetCurrency,
                s.getBillingCycle(), s.getDetectedAt(), s.getStatus(), s.getCard().getId()
        );
    }
}
