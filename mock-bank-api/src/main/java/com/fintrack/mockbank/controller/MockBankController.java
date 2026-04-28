package com.fintrack.mockbank.controller;

import com.fintrack.mockbank.dto.CancelRequest;
import com.fintrack.mockbank.dto.CancelResponse;
import com.fintrack.mockbank.dto.TransactionResponse;
import com.fintrack.mockbank.service.MockBankService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bank")
@RequiredArgsConstructor
public class MockBankController {

    private final MockBankService mockBankService;

    @GetMapping("/cards/{cardNumber}/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            @PathVariable String cardNumber) {
        return ResponseEntity.ok(mockBankService.getTransactions(cardNumber));
    }

    @PostMapping("/cards/{cardNumber}/cancel")
    public ResponseEntity<CancelResponse> cancelSubscription(
            @PathVariable String cardNumber,
            @RequestBody CancelRequest request) {
        return ResponseEntity.ok(mockBankService.cancelSubscription(cardNumber, request));
    }
}
