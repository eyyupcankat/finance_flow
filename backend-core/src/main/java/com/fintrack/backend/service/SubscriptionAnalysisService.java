package com.fintrack.backend.service;

import com.fintrack.backend.dto.SubscriptionResponse;
import com.fintrack.backend.dto.mockbank.MockBankTransactionDto;
import com.fintrack.backend.entity.Subscription;
import com.fintrack.backend.entity.User;
import com.fintrack.backend.entity.VirtualCard;
import com.fintrack.backend.exception.ResourceNotFoundException;
import com.fintrack.backend.repository.SubscriptionRepository;
import com.fintrack.backend.repository.UserRepository;
import com.fintrack.backend.repository.VirtualCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionAnalysisService {

    private final WebClient mockBankWebClient;
    private final VirtualCardRepository cardRepository;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    public List<SubscriptionResponse> analyzeCard(Long cardId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "User not found"));

        VirtualCard card = cardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("CARD_NOT_FOUND", "Card not found for this account"));

        List<MockBankTransactionDto> transactions = fetchTransactions(card.getCardNumber());

        transactions.stream()
                .filter(t -> Boolean.TRUE.equals(t.isRecurring()))
                .filter(t -> !subscriptionRepository.existsByCardIdAndName(cardId, t.merchant()))
                .forEach(t -> {
                    Subscription subscription = Subscription.builder()
                            .user(user)
                            .card(card)
                            .name(t.merchant())
                            .amount(t.amount() != null ? t.amount() : BigDecimal.ZERO)
                            .currency(t.currency() != null ? t.currency() : "USD")
                            .billingCycle("MONTHLY")
                            .build();
                    subscriptionRepository.save(subscription);
                });

        return subscriptionRepository.findByCardId(cardId)
                .stream()
                .map(SubscriptionResponse::from)
                .toList();
    }

    private List<MockBankTransactionDto> fetchTransactions(String cardNumber) {
        try {
            List<MockBankTransactionDto> result = mockBankWebClient
                    .get()
                    .uri("/api/v1/bank/cards/{cardNumber}/transactions", cardNumber)
                    .retrieve()
                    .bodyToFlux(MockBankTransactionDto.class)
                    .collectList()
                    .block();
            return result != null ? result : List.of();
        } catch (WebClientResponseException.NotFound e) {
            throw new ResourceNotFoundException("CARD_NOT_FOUND_IN_MOCK_BANK", "Card " + cardNumber + " not found in Mock Bank");
        }
    }
}
