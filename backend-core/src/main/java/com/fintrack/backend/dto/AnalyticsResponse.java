package com.fintrack.backend.dto;

import com.fintrack.backend.dto.mockbank.MockBankTransactionDto;
import java.math.BigDecimal;
import java.util.List;

public record AnalyticsResponse(
    BigDecimal totalSavings,
    BigDecimal periodSpending,
    BigDecimal totalAssets,
    BigDecimal investmentReturn,
    String savingsTrend,
    String spendingTrend,
    boolean savingsPositive,
    boolean spendingPositive,
    List<MonthlyTrend> chartData,
    List<CategoryStat> categories,
    List<MockBankTransactionDto> transactions
) {
    public record MonthlyTrend(String month, BigDecimal amount) {}
    public record CategoryStat(String name, BigDecimal value, String fill) {}
}
