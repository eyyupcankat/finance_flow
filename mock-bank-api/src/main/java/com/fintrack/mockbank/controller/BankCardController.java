package com.fintrack.mockbank.controller;

import com.fintrack.mockbank.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/bank/cards")
@RequiredArgsConstructor
public class BankCardController {

    private final CardRepository cardRepository;

    @GetMapping("/{cardNumber}/validate")
    public ResponseEntity<?> validateCard(@PathVariable String cardNumber) {
        boolean exists = cardRepository.existsByCardNumber(cardNumber);
        if (exists) {
            return ResponseEntity.ok(Map.of("valid", true, "message", "Card validated successfully"));
        } else {
            return ResponseEntity.status(404).body(Map.of("valid", false, "message", "Card not found in bank records"));
        }
    }
}
