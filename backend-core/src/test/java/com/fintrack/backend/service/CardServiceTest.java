package com.fintrack.backend.service;

import com.fintrack.backend.dto.CardRequest;
import com.fintrack.backend.dto.CardResponse;
import com.fintrack.backend.entity.User;
import com.fintrack.backend.entity.VirtualCard;
import com.fintrack.backend.exception.ResourceNotFoundException;
import com.fintrack.backend.repository.UserRepository;
import com.fintrack.backend.repository.VirtualCardRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CardServiceTest {

    @Mock VirtualCardRepository cardRepository;
    @Mock UserRepository userRepository;

    @InjectMocks CardService cardService;

    private VirtualCard buildCard(Long id, String cardNumber, Long userId) {
        User user = User.builder().id(userId).build();
        VirtualCard card = new VirtualCard();
        card.setId(id);
        card.setCardNumber(cardNumber);
        card.setLabel("My Card");
        card.setUser(user);
        card.setAddedAt(LocalDateTime.now());
        return card;
    }

    @Test
    void getCards_returnsAllCardsForUser() {
        when(cardRepository.findByUserId(1L)).thenReturn(List.of(
                buildCard(1L, "4111000000000000", 1L),
                buildCard(2L, "4222000000000000", 1L)
        ));

        List<CardResponse> cards = cardService.getCards(1L);

        assertThat(cards).hasSize(2);
        assertThat(cards).extracting(CardResponse::cardNumber)
                .containsExactlyInAnyOrder("4111000000000000", "4222000000000000");
    }

    @Test
    void getCards_noCards_returnsEmptyList() {
        when(cardRepository.findByUserId(1L)).thenReturn(List.of());

        List<CardResponse> cards = cardService.getCards(1L);

        assertThat(cards).isEmpty();
    }

    @Test
    void addCard_success_returnsCardResponse() {
        CardRequest req = new CardRequest("4111000000000000", "Main Card");
        User user = User.builder().id(1L).build();
        VirtualCard saved = buildCard(1L, "4111000000000000", 1L);

        when(cardRepository.existsByUserIdAndCardNumber(1L, "4111000000000000")).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cardRepository.save(any())).thenReturn(saved);

        CardResponse response = cardService.addCard(1L, req);

        assertThat(response.cardNumber()).isEqualTo("4111000000000000");
        assertThat(response.id()).isEqualTo(1L);
        verify(cardRepository).save(any(VirtualCard.class));
    }

    @Test
    void addCard_duplicateCard_throwsConflict() {
        CardRequest req = new CardRequest("4111000000000000", "Main Card");
        when(cardRepository.existsByUserIdAndCardNumber(1L, "4111000000000000")).thenReturn(true);

        assertThatThrownBy(() -> cardService.addCard(1L, req))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.CONFLICT));

        verify(cardRepository, never()).save(any());
    }

    @Test
    void deleteCard_success_deletesCard() {
        VirtualCard card = buildCard(1L, "4111000000000000", 1L);
        when(cardRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(card));

        assertThatCode(() -> cardService.deleteCard(1L, 1L)).doesNotThrowAnyException();
        verify(cardRepository).delete(card);
    }

    @Test
    void deleteCard_cardNotFound_throwsResourceNotFoundException() {
        when(cardRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cardService.deleteCard(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Card not found");
    }
}
