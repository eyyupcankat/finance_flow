package com.fintrack.backend.service;

import com.fintrack.backend.dto.DashboardSummaryResponse;
import com.fintrack.backend.dto.mockbank.MockBankTransactionDto;
import com.fintrack.backend.entity.User;
import com.fintrack.backend.entity.VirtualCard;
import com.fintrack.backend.exception.ResourceNotFoundException;
import com.fintrack.backend.repository.UserRepository;
import com.fintrack.backend.repository.VirtualCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VirtualCardRepository cardRepository;
    private final UserRepository userRepository;
    private final WebClient mockBankWebClient;
    private final CurrencyConversionService currencyService;

    public List<MockBankTransactionDto> getRecentTransactions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "User not found"));

        List<VirtualCard> cards = cardRepository.findByUserId(userId);
        List<MockBankTransactionDto> allTransactions = new ArrayList<>();

        for (VirtualCard card : cards) {
            allTransactions.addAll(fetchTransactions(card.getCardNumber()));
        }

        String targetCurrency = user.getCurrency();

        return allTransactions.stream()
                .map(tx -> new MockBankTransactionDto(
                        tx.id(), tx.cardNumber(), tx.merchant(), tx.description(),
                        currencyService.convert(tx.amount(), tx.currency(), targetCurrency),
                        targetCurrency,
                        tx.transactionDate(), tx.category(), tx.isRecurring()
                ))
                .sorted(Comparator.comparing(MockBankTransactionDto::transactionDate).reversed())
                .limit(100)
                .toList();
    }

    public DashboardSummaryResponse getSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "User not found"));
        
        List<MockBankTransactionDto> allTransactions = getRecentTransactions(userId);

        BigDecimal totalBalance = BigDecimal.ZERO;
        BigDecimal monthlyIncome = BigDecimal.ZERO;
        BigDecimal monthlyExpenses = BigDecimal.ZERO;

        for (MockBankTransactionDto tx : allTransactions) {
            BigDecimal amt = tx.amount() != null ? tx.amount() : BigDecimal.ZERO;
            totalBalance = totalBalance.add(amt);
            if (amt.compareTo(BigDecimal.ZERO) > 0) {
                monthlyIncome = monthlyIncome.add(amt);
            } else {
                monthlyExpenses = monthlyExpenses.add(amt.abs());
            }
        }

        return new DashboardSummaryResponse(
                totalBalance,
                monthlyIncome,
                monthlyExpenses,
                "+4.5%", "On track", "+12%",
                true, true, false
        );
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
            return List.of(); // If card is not found in Mock Bank, just return empty transactions for it
        }
    }
}
