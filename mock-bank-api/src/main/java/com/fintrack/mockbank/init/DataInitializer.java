package com.fintrack.mockbank.init;

import com.fintrack.mockbank.entity.Card;
import com.fintrack.mockbank.entity.Transaction;
import com.fintrack.mockbank.repository.CardRepository;
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
    private final CardRepository cardRepository;

    private static final String CARD_FULL    = "4111000000000000";
    private static final String CARD_NONE    = "4222000000000000";
    private static final String CARD_MINIMAL = "4333000000000000";

    @Override
    public void run(String... args) {
        // Clear existing data to force update with new income/expense format
        transactionRepository.deleteAll();
        cardRepository.deleteAll();
        
        // Seed Cards
        cardRepository.saveAll(List.of(
            Card.builder().cardNumber(CARD_FULL).cardHolderName("Alex Rivera").bankName("Mock National Bank").build(),
            Card.builder().cardNumber(CARD_NONE).cardHolderName("Jane Doe").bankName("Mock National Bank").build(),
            Card.builder().cardNumber(CARD_MINIMAL).cardHolderName("John Smith").bankName("Mock National Bank").build()
        ));
        
        transactionRepository.saveAll(buildFullDataset());
        transactionRepository.saveAll(buildNoRecurringDataset());
        transactionRepository.saveAll(buildMinimalDataset());
    }

    private List<Transaction> buildFullDataset() {
        return List.of(
            // --- Income ---
            tx(CARD_FULL, "Tech Corp",     "Monthly Salary",           "4250.00", "Income",       "2024-10-25", false),
            tx(CARD_FULL, "Tech Corp",     "Monthly Salary",           "4250.00", "Income",       "2024-09-25", false),
            
            // --- Subscriptions (Negative) ---
            tx(CARD_FULL, "Netflix",       "Monthly streaming plan",   "-15.99",  "Entertainment", "2024-08-01", true),
            tx(CARD_FULL, "Netflix",       "Monthly streaming plan",   "-15.99",  "Entertainment", "2024-09-01", true),
            tx(CARD_FULL, "Netflix",       "Monthly streaming plan",   "-15.99",  "Entertainment", "2024-10-01", true),
            tx(CARD_FULL, "Spotify",       "Premium music subscription","-9.99",  "Entertainment", "2024-08-01", true),
            tx(CARD_FULL, "Spotify",       "Premium music subscription","-9.99",  "Entertainment", "2024-09-01", true),
            tx(CARD_FULL, "Spotify",       "Premium music subscription","-9.99",  "Entertainment", "2024-10-01", true),
            tx(CARD_FULL, "Amazon Prime",  "Annual membership monthly", "-14.99", "Shopping",      "2024-08-15", true),
            tx(CARD_FULL, "Amazon Prime",  "Annual membership monthly", "-14.99", "Shopping",      "2024-09-15", true),
            tx(CARD_FULL, "Amazon Prime",  "Annual membership monthly", "-14.99", "Shopping",      "2024-10-15", true),
            tx(CARD_FULL, "Adobe CC",      "Creative Cloud all apps",   "-54.99", "Software",      "2024-09-05", true),
            tx(CARD_FULL, "Adobe CC",      "Creative Cloud all apps",   "-54.99", "Software",      "2024-10-05", true),
            
            // --- Purchases (Negative) ---
            tx(CARD_FULL, "Starbucks",     "Coffee purchase",           "-5.50",  "Food & Drink",  "2024-10-15", false),
            tx(CARD_FULL, "Uber",          "Trip to downtown",          "-22.50", "Transport",     "2024-10-12", false),
            tx(CARD_FULL, "Apple Store",   "AirPods Pro",               "-149.00","Technology",    "2024-10-05", false),
            tx(CARD_FULL, "Whole Foods",   "Weekly groceries",          "-84.15", "Groceries",     "2024-10-08", false),
            tx(CARD_FULL, "Shell",         "Fuel",                      "-60.00", "Transport",     "2024-10-03", false),
            tx(CARD_FULL, "Nike Store",    "Running Shoes",             "-120.00","Shopping",      "2024-10-01", false),
            tx(CARD_FULL, "Best Buy",      "Keyboard",                  "-75.00", "Technology",    "2024-09-28", false),
            tx(CARD_FULL, "Cinema",        "Movie night",               "-35.00", "Entertainment", "2024-09-27", false),
            tx(CARD_FULL, "Pharmacy",      "Medicine",                  "-45.00", "Health",        "2024-09-26", false),
            tx(CARD_FULL, "Bookstore",     "Fiction Book",              "-18.00", "Shopping",      "2024-09-24", false),
            tx(CARD_FULL, "Gym",           "Monthly Membership",        "-50.00", "Health",        "2024-09-20", false),
            tx(CARD_FULL, "Coffee Shop",   "Latte",                     "-4.50",  "Food & Drink",  "2024-09-18", false),
            tx(CARD_FULL, "Electric Co",   "Utility Bill",              "-120.00","Bills",         "2024-09-15", false),
            tx(CARD_FULL, "Gas Co",        "Utility Bill",              "-45.00", "Bills",         "2024-09-14", false),
            tx(CARD_FULL, "Internet",      "Fiber Connection",          "-80.00", "Bills",         "2024-09-12", false)
        );
    }

    private List<Transaction> buildNoRecurringDataset() {
        return List.of(
            tx(CARD_NONE, "Starbucks",   "Coffee purchase",  "-5.50",  "Food & Drink", "2024-10-15", false),
            tx(CARD_NONE, "H&M",         "Clothing purchase","-45.00", "Shopping",     "2024-10-12", false),
            tx(CARD_NONE, "Pizza Hut",   "Dinner order",     "-18.00", "Food & Drink", "2024-10-10", false),
            tx(CARD_NONE, "Shell",       "Fuel",             "-60.00", "Transport",    "2024-10-08", false)
        );
    }

    private List<Transaction> buildMinimalDataset() {
        return List.of(
            tx(CARD_MINIMAL, "Starbucks Coffee", "Morning coffee", "-3.50", "Food & Drink", "2024-10-15", false)
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
