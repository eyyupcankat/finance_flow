package com.fintrack.backend.controller;

import com.fintrack.backend.dto.CardRequest;
import com.fintrack.backend.dto.CardResponse;
import com.fintrack.backend.security.UserPrincipal;
import com.fintrack.backend.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping
    public ResponseEntity<List<CardResponse>> getCards(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(cardService.getCards(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<CardResponse> addCard(@AuthenticationPrincipal UserPrincipal principal,
                                                @Valid @RequestBody CardRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cardService.addCard(principal.getId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(@AuthenticationPrincipal UserPrincipal principal,
                                           @PathVariable Long id) {
        cardService.deleteCard(id, principal.getId());
        return ResponseEntity.noContent().build();
    }
}
