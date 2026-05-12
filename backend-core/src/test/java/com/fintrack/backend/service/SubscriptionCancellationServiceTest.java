package com.fintrack.backend.service;

import com.fintrack.backend.dto.SubscriptionResponse;
import com.fintrack.backend.dto.mockbank.MockBankCancelResponse;
import com.fintrack.backend.entity.*;
import com.fintrack.backend.exception.ResourceNotFoundException;
import com.fintrack.backend.repository.SubscriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SuppressWarnings({"rawtypes"})
@ExtendWith(MockitoExtension.class)
class SubscriptionCancellationServiceTest {

    @Mock WebClient mockBankWebClient;
    @Mock WebClient.RequestBodyUriSpec requestBodyUriSpec;
    @Mock WebClient.RequestBodySpec requestBodySpec;
    @Mock WebClient.RequestHeadersSpec requestHeadersSpec;
    @Mock WebClient.ResponseSpec responseSpec;

    @Mock SubscriptionRepository subscriptionRepository;

    @InjectMocks SubscriptionCancellationService cancellationService;

    private Subscription subscription;
    private VirtualCard card;
    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).email("test@example.com").name("Test").build();
        card = new VirtualCard();
        card.setId(1L);
        card.setCardNumber("4111000000000000");
        card.setLabel("Main");
        card.setUser(user);
        card.setAddedAt(LocalDateTime.now());

        subscription = Subscription.builder()
                .id(1L).user(user).card(card)
                .name("Netflix").amount(BigDecimal.valueOf(9.99))
                .currency("USD").billingCycle("MONTHLY")
                .status(SubscriptionStatus.ACTIVE)
                .build();
    }

    private void mockWebClientPost() {
        doReturn(requestBodyUriSpec).when(mockBankWebClient).post();
        doReturn(requestBodySpec).when(requestBodyUriSpec).uri(anyString(), (Object) any());
        doReturn(requestBodySpec).when(requestBodySpec).contentType(any());
        doReturn(requestHeadersSpec).when(requestBodySpec).bodyValue(any());
        doReturn(responseSpec).when(requestHeadersSpec).retrieve();

        MockBankCancelResponse cancelResponse = new MockBankCancelResponse(
                true, "Cancelled", "4111000000000000", "Netflix", LocalDateTime.now());
        doReturn(Mono.just(cancelResponse)).when(responseSpec).bodyToMono(MockBankCancelResponse.class);
    }

    @Test
    void cancelSubscription_activeSubscription_setsStatusCancelled() {
        when(subscriptionRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(subscription));
        mockWebClientPost();

        Subscription cancelled = Subscription.builder()
                .id(1L).user(user).card(card).name("Netflix")
                .amount(BigDecimal.valueOf(9.99)).currency("USD")
                .billingCycle("MONTHLY").status(SubscriptionStatus.CANCELLED).build();
        when(subscriptionRepository.save(any())).thenReturn(cancelled);

        SubscriptionResponse response = cancellationService.cancelSubscription(1L, 1L);

        assertThat(response.status()).isEqualTo(SubscriptionStatus.CANCELLED);
        verify(subscriptionRepository).save(any(Subscription.class));
    }

    @Test
    void cancelSubscription_alreadyCancelled_returnsWithoutCallingMockBank() {
        subscription.setStatus(SubscriptionStatus.CANCELLED);
        when(subscriptionRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(subscription));

        SubscriptionResponse response = cancellationService.cancelSubscription(1L, 1L);

        assertThat(response.status()).isEqualTo(SubscriptionStatus.CANCELLED);
        verify(mockBankWebClient, never()).post();
        verify(subscriptionRepository, never()).save(any());
    }

    @Test
    void cancelSubscription_notFound_throwsResourceNotFoundException() {
        when(subscriptionRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cancellationService.cancelSubscription(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Subscription not found");
    }
}
