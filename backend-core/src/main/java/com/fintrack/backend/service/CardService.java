package com.fintrack.backend.service;

import com.fintrack.backend.dto.CardRequest;
import com.fintrack.backend.dto.CardResponse;
import com.fintrack.backend.entity.User;
import com.fintrack.backend.entity.VirtualCard;
import com.fintrack.backend.exception.ResourceNotFoundException;
import com.fintrack.backend.repository.UserRepository;
import com.fintrack.backend.repository.VirtualCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final VirtualCardRepository cardRepository;
    private final UserRepository userRepository;

    public List<CardResponse> getCards(Long userId) {
        return cardRepository.findByUserId(userId)
                .stream()
                .map(CardResponse::from)
                .toList();
    }

    public CardResponse addCard(Long userId, CardRequest request) {
        if (cardRepository.existsByUserIdAndCardNumber(userId, request.cardNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Card already linked to your account");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        VirtualCard card = VirtualCard.builder()
                .user(user)
                .cardNumber(request.cardNumber())
                .label(request.label())
                .build();

        return CardResponse.from(cardRepository.save(card));
    }

    public void deleteCard(Long cardId, Long userId) {
        VirtualCard card = cardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        cardRepository.delete(card);
    }
}
