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
import java.util.ArrayList;
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
        transactionRepository.deleteAll();
        cardRepository.deleteAll();
        
        cardRepository.saveAll(List.of(
            Card.builder().cardNumber(CARD_FULL).cardHolderName("Alex Rivera").bankName("Mock National Bank").build(),
            Card.builder().cardNumber(CARD_NONE).cardHolderName("Jane Doe").bankName("Mock National Bank").build(),
            Card.builder().cardNumber(CARD_MINIMAL).cardHolderName("John Smith").bankName("Mock National Bank").build()
        ));
        
        LocalDate now = LocalDate.now();
        List<Transaction> txs = new ArrayList<>();

        // CARD_FULL - Mix of income, spending, and subscriptions
        // Income
        txs.add(tx(CARD_FULL, "Tech Corp", "Salary", "5200.00", "Income", now.minusDays(2), false));
        txs.add(tx(CARD_FULL, "Freelance", "Project X", "1500.00", "Income", now.minusDays(15), false));

        // Recent Spending (Last 7 days)
        txs.add(tx(CARD_FULL, "Starbucks", "Coffee", "-5.50", "Food", now.minusDays(1), false));
        txs.add(tx(CARD_FULL, "Uber", "Trip", "-25.00", "Transport", now.minusDays(2), false));
        txs.add(tx(CARD_FULL, "Whole Foods", "Groceries", "-120.00", "Groceries", now.minusDays(3), false));
        txs.add(tx(CARD_FULL, "Amazon", "Book", "-15.00", "Shopping", now.minusDays(5), false));

        // Subscriptions (Recurring)
        txs.add(tx(CARD_FULL, "Netflix", "Streaming", "-19.99", "Entertainment", now.withDayOfMonth(1), true));
        txs.add(tx(CARD_FULL, "Spotify", "Music", "-9.99", "Entertainment", now.withDayOfMonth(1), true));
        txs.add(tx(CARD_FULL, "Adobe CC", "Software", "-54.99", "Technology", now.withDayOfMonth(5), true));

        // Older spending (For Monthly/Yearly view)
        txs.add(tx(CARD_FULL, "Apple Store", "AirPods", "-249.00", "Technology", now.minusDays(20), false));
        txs.add(tx(CARD_FULL, "Rent", "Monthly Rent", "-1800.00", "Living", now.minusDays(25), false));
        txs.add(tx(CARD_FULL, "Nike", "Shoes", "-110.00", "Shopping", now.minusMonths(2), false));
        txs.add(tx(CARD_FULL, "Flight", "Holiday", "-850.00", "Transport", now.minusMonths(4), false));

        // CARD_NONE - Now has transactions
        txs.add(tx(CARD_NONE, "Gig Economy", "Side Hustle", "800.00", "Income", now.minusDays(5), false));
        txs.add(tx(CARD_NONE, "McDonalds", "Lunch", "-12.50", "Food", now.minusDays(1), false));
        txs.add(tx(CARD_NONE, "Uber", "Trip", "-15.00", "Transport", now.minusDays(2), false));
        txs.add(tx(CARD_NONE, "Shell", "Gas", "-60.00", "Transport", now.minusDays(4), false));
        txs.add(tx(CARD_NONE, "Amazon", "Prime Member", "-14.99", "Shopping", now.withDayOfMonth(10), true));
        txs.add(tx(CARD_NONE, "YouTube", "Premium", "-11.99", "Entertainment", now.withDayOfMonth(15), true));
        txs.add(tx(CARD_NONE, "Steam", "Game Purchase", "-59.99", "Entertainment", now.minusDays(10), false));
        txs.add(tx(CARD_NONE, "Local Grocery", "Food", "-45.00", "Groceries", now.minusDays(12), false));
        txs.add(tx(CARD_NONE, "Gym", "Monthly Membership", "-35.00", "Health", now.withDayOfMonth(1), true));
        txs.add(tx(CARD_NONE, "Electricity", "Utility Bill", "-120.00", "Bills", now.minusDays(20), false));

        // CARD_MINIMAL - Minimal but has enough for testing
        txs.add(tx(CARD_MINIMAL, "Investment Div", "Dividends", "150.00", "Income", now.minusDays(10), false));
        txs.add(tx(CARD_MINIMAL, "Subway", "Dinner", "-8.00", "Food", now.minusDays(1), false));
        txs.add(tx(CARD_MINIMAL, "App Store", "iCloud", "-0.99", "Technology", now.withDayOfMonth(1), true));
        txs.add(tx(CARD_MINIMAL, "App Store", "Apple Music", "-10.99", "Entertainment", now.withDayOfMonth(1), true));
        txs.add(tx(CARD_MINIMAL, "Medium", "Reading", "-5.00", "Education", now.withDayOfMonth(12), true));
        txs.add(tx(CARD_MINIMAL, "New York Times", "News", "-4.00", "Education", now.withDayOfMonth(1), true));
        txs.add(tx(CARD_MINIMAL, "Parking", "City Hall", "-10.00", "Transport", now.minusDays(15), false));
        txs.add(tx(CARD_MINIMAL, "Cinema", "Movie Night", "-18.00", "Entertainment", now.minusDays(22), false));
        txs.add(tx(CARD_MINIMAL, "Bakery", "Breakfast", "-6.50", "Food", now.minusDays(28), false));
        txs.add(tx(CARD_MINIMAL, "Donation", "Charity", "-25.00", "Other", now.minusDays(5), false));

        transactionRepository.saveAll(txs);
    }

    private Transaction tx(String card, String merchant, String desc,
                           String amount, String category, LocalDate date, boolean recurring) {
        return Transaction.builder()
                .cardNumber(card)
                .merchant(merchant)
                .description(desc)
                .amount(new BigDecimal(amount))
                .currency("USD")
                .transactionDate(date)
                .category(category)
                .recurring(recurring)
                .build();
    }
}
