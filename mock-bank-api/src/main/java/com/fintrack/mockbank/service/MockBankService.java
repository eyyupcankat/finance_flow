package com.fintrack.mockbank.service;

import com.fintrack.mockbank.dto.CancelRequest;
import com.fintrack.mockbank.dto.CancelResponse;
import com.fintrack.mockbank.dto.TransactionResponse;
import com.fintrack.mockbank.entity.CancellationRecord;
import com.fintrack.mockbank.entity.Transaction;
import com.fintrack.mockbank.exception.CardNotFoundException;
import com.fintrack.mockbank.repository.CancellationRepository;
import com.fintrack.mockbank.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MockBankService {

    private static final String CARD_NOT_FOUND = "9999000000000000";

    private final TransactionRepository transactionRepository;
    private final CancellationRepository cancellationRepository;

    public List<TransactionResponse> getTransactions(String cardNumber) {
        if (CARD_NOT_FOUND.equals(cardNumber)) {
            throw new CardNotFoundException(cardNumber);
        }
        List<Transaction> transactions = transactionRepository.findByCardNumber(cardNumber);
        return transactions.stream().map(this::toResponse).toList();
    }

    public CancelResponse cancelSubscription(String cardNumber, CancelRequest request) {
        if (CARD_NOT_FOUND.equals(cardNumber)) {
            throw new CardNotFoundException(cardNumber);
        }

        return cancellationRepository
                .findByCardNumberAndServiceName(cardNumber, request.serviceName())
                .map(existing -> new CancelResponse(
                        true,
                        "Subscription already cancelled.",
                        cardNumber,
                        request.serviceName(),
                        existing.getCancelledAt()
                ))
                .orElseGet(() -> {
                    LocalDateTime now = LocalDateTime.now();
                    CancellationRecord record = CancellationRecord.builder()
                            .cardNumber(cardNumber)
                            .serviceName(request.serviceName())
                            .cancelledAt(now)
                            .status("CANCELLED")
                            .build();
                    cancellationRepository.save(record);
                    return new CancelResponse(
                            true,
                            "Subscription cancellation recorded successfully.",
                            cardNumber,
                            request.serviceName(),
                            now
                    );
                });
    }

    private TransactionResponse toResponse(Transaction t) {
        return new TransactionResponse(
                t.getId(),
                t.getCardNumber(),
                t.getMerchant(),
                t.getDescription(),
                t.getAmount(),
                t.getCurrency(),
                t.getTransactionDate(),
                t.getCategory(),
                t.isRecurring()
        );
    }
}
