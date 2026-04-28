package com.fintrack.mockbank.init;

import com.fintrack.mockbank.entity.Transaction;
import com.fintrack.mockbank.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TransactionRepository transactionRepository;

    private static final String CARD_FULL    = "4111000000000000";
    private static final String CARD_NONE    = "4222000000000000";
    private static final String CARD_MINIMAL = "4333000000000000";

    @Override
    public void run(String... args) {
        if (transactionRepository.existsByCardNumber(CARD_FULL)) {
            return;
        }
        transactionRepository.saveAll(buildFullDataset());
        transactionRepository.saveAll(buildNoRecurringDataset());
        transactionRepository.saveAll(buildMinimalDataset());
    }

    private List<Transaction> buildFullDataset() {
        return List.of(
            tx(CARD_FULL, "Netflix",       "Monthly streaming plan",   "15.99",  "Entertainment", "2024-08-01", true),
            tx(CARD_FULL, "Netflix",       "Monthly streaming plan",   "15.99",  "Entertainment", "2024-09-01", true),
            tx(CARD_FULL, "Netflix",       "Monthly streaming plan",   "15.99",  "Entertainment", "2024-10-01", true),
            tx(CARD_FULL, "Spotify",       "Premium music subscription","9.99",  "Entertainment", "2024-08-01", true),
            tx(CARD_FULL, "Spotify",       "Premium music subscription","9.99",  "Entertainment", "2024-09-01", true),
            tx(CARD_FULL, "Spotify",       "Premium music subscription","9.99",  "Entertainment", "2024-10-01", true),
            tx(CARD_FULL, "Amazon Prime",  "Annual membership monthly", "14.99", "Shopping",      "2024-08-15", true),
            tx(CARD_FULL, "Amazon Prime",  "Annual membership monthly", "14.99", "Shopping",      "2024-09-15", true),
            tx(CARD_FULL, "Amazon Prime",  "Annual membership monthly", "14.99", "Shopping",      "2024-10-15", true),
            tx(CARD_FULL, "Adobe CC",      "Creative Cloud all apps",   "54.99", "Software",      "2024-09-05", true),
            tx(CARD_FULL, "Adobe CC",      "Creative Cloud all apps",   "54.99", "Software",      "2024-10-05", true),
            tx(CARD_FULL, "Starbucks",     "Coffee purchase",           "5.50",  "Food & Drink",  "2024-10-15", false),
            tx(CARD_FULL, "Uber",          "Trip to downtown",          "22.50", "Transport",     "2024-10-12", false),
            tx(CARD_FULL, "Apple Store",   "AirPods Pro",               "149.00","Technology",    "2024-10-05", false),
            tx(CARD_FULL, "Whole Foods",   "Weekly groceries",          "84.15", "Groceries",     "2024-10-08", false),
            tx(CARD_FULL, "Shell",         "Fuel",                      "60.00", "Transport",     "2024-10-03", false)
        );
    }

    private List<Transaction> buildNoRecurringDataset() {
        return List.of(
            tx(CARD_NONE, "Starbucks",   "Coffee purchase",  "5.50",  "Food & Drink", "2024-10-15", false),
            tx(CARD_NONE, "H&M",         "Clothing purchase","45.00", "Shopping",     "2024-10-12", false),
            tx(CARD_NONE, "Pizza Hut",   "Dinner order",     "18.00", "Food & Drink", "2024-10-10", false),
            tx(CARD_NONE, "Shell",       "Fuel",             "60.00", "Transport",    "2024-10-08", false)
        );
    }

    private List<Transaction> buildMinimalDataset() {
        return List.of(
            tx(CARD_MINIMAL, "Starbucks Coffee", "Morning coffee", "3.50", "Food & Drink", "2024-10-15", false)
        );
    }

    private Transaction tx(String card, String merchant, String desc,
                           String amount, String category, String date, boolean recurring) {
        return Transaction.builder()
                .cardNumber(card)
                .merchant(merchant)
                .description(desc)
                .amount(new BigDecimal(amount))
                .currency("USD")
                .transactionDate(LocalDate.parse(date))
                .category(category)
                .recurring(recurring)
                .build();
    }
}
