package com.fintrack.backend.service;

import com.fintrack.backend.dto.SubscriptionResponse;
import com.fintrack.backend.dto.mockbank.MockBankTransactionDto;
import com.fintrack.backend.entity.Subscription;
import com.fintrack.backend.entity.SubscriptionStatus;
import com.fintrack.backend.entity.User;
import com.fintrack.backend.entity.VirtualCard;
import com.fintrack.backend.exception.ResourceNotFoundException;
import com.fintrack.backend.repository.SubscriptionRepository;
import com.fintrack.backend.repository.UserRepository;
import com.fintrack.backend.repository.VirtualCardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SuppressWarnings({"unchecked", "rawtypes"})
@ExtendWith(MockitoExtension.class)
class SubscriptionAnalysisServiceTest {

    @Mock WebClient mockBankWebClient;
    @Mock WebClient.RequestHeadersUriSpec requestHeadersUriSpec;
    @Mock WebClient.RequestHeadersSpec requestHeadersSpec;
    @Mock WebClient.ResponseSpec responseSpec;

    @Mock VirtualCardRepository cardRepository;
    @Mock UserRepository userRepository;
    @Mock SubscriptionRepository subscriptionRepository;

    @InjectMocks SubscriptionAnalysisService analysisService;

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
    }

    private MockBankTransactionDto buildTransaction(String merchant, boolean recurring) {
        return new MockBankTransactionDto(1L, "4111000000000000", merchant,
                merchant + " subscription", BigDecimal.valueOf(9.99),
                "USD", LocalDate.now(), "ENTERTAINMENT", recurring);
    }

    private void mockWebClientGet(Flux<MockBankTransactionDto> flux) {
        doReturn(requestHeadersUriSpec).when(mockBankWebClient).get();
        doReturn(requestHeadersSpec).when(requestHeadersUriSpec).uri(anyString(), (Object) any());
        doReturn(responseSpec).when(requestHeadersSpec).retrieve();
        doReturn(flux).when(responseSpec).bodyToFlux(MockBankTransactionDto.class);
    }

    @Test
    void analyzeCard_withRecurringTransactions_savesAndReturnsSubscriptions() {
        MockBankTransactionDto netflix = buildTransaction("Netflix", true);
        MockBankTransactionDto coffee = buildTransaction("Starbucks", false);

        when(cardRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(card));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        mockWebClientGet(Flux.just(netflix, coffee));
        when(subscriptionRepository.existsByCardIdAndName(1L, "Netflix")).thenReturn(false);

        Subscription saved = Subscription.builder()
                .id(1L).user(user).card(card).name("Netflix")
                .amount(BigDecimal.valueOf(9.99)).currency("USD")
                .billingCycle("MONTHLY").status(SubscriptionStatus.ACTIVE).build();
        when(subscriptionRepository.save(any())).thenReturn(saved);
        when(subscriptionRepository.findByCardId(1L)).thenReturn(List.of(saved));

        List<SubscriptionResponse> result = analysisService.analyzeCard(1L, 1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("Netflix");
        verify(subscriptionRepository, times(1)).save(any(Subscription.class));
        verify(subscriptionRepository, never()).save(argThat(s -> s.getName().equals("Starbucks")));
    }

    @Test
    void analyzeCard_alreadyDetectedSubscription_doesNotSaveDuplicate() {
        MockBankTransactionDto netflix = buildTransaction("Netflix", true);

        when(cardRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(card));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        mockWebClientGet(Flux.just(netflix));
        when(subscriptionRepository.existsByCardIdAndName(1L, "Netflix")).thenReturn(true);
        when(subscriptionRepository.findByCardId(1L)).thenReturn(List.of());

        analysisService.analyzeCard(1L, 1L);

        verify(subscriptionRepository, never()).save(any());
    }

    @Test
    void analyzeCard_noRecurringTransactions_savesNothing() {
        MockBankTransactionDto tx = buildTransaction("Starbucks", false);

        when(cardRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(card));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        mockWebClientGet(Flux.just(tx));
        when(subscriptionRepository.findByCardId(1L)).thenReturn(List.of());

        List<SubscriptionResponse> result = analysisService.analyzeCard(1L, 1L);

        assertThat(result).isEmpty();
        verify(subscriptionRepository, never()).save(any());
    }

    @Test
    void analyzeCard_cardNotBelongingToUser_throwsResourceNotFoundException() {
        when(cardRepository.findByIdAndUserId(1L, 99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> analysisService.analyzeCard(1L, 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Card not found");
    }

    @Test
    void analyzeCard_mockBankReturns404_throwsResourceNotFoundException() {
        when(cardRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(card));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        doReturn(requestHeadersUriSpec).when(mockBankWebClient).get();
        doReturn(requestHeadersSpec).when(requestHeadersUriSpec).uri(anyString(), (Object) any());
        doReturn(responseSpec).when(requestHeadersSpec).retrieve();
        doThrow(WebClientResponseException.NotFound.class).when(responseSpec).bodyToFlux(MockBankTransactionDto.class);

        assertThatThrownBy(() -> analysisService.analyzeCard(1L, 1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
