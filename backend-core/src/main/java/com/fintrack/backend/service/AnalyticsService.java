package com.fintrack.backend.service;

import com.fintrack.backend.dto.AnalyticsResponse;
import com.fintrack.backend.dto.mockbank.MockBankTransactionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final DashboardService dashboardService;
    private static final DateTimeFormatter MONTH_DAY_FMT = DateTimeFormatter.ofPattern("d MMM");

    public AnalyticsResponse getAnalytics(Long userId, String timeframe) {
        List<MockBankTransactionDto> allTransactions = dashboardService.getRecentTransactions(userId);
        
        LocalDate now = LocalDate.now();
        LocalDate startDate = getStartDate(now, timeframe);
        LocalDate prevStartDate = getPreviousPeriodStartDate(startDate, timeframe);

        List<MockBankTransactionDto> currentPeriodTxs = allTransactions.stream()
                .filter(tx -> !tx.transactionDate().isBefore(startDate) && !tx.transactionDate().isAfter(now))
                .toList();

        List<MockBankTransactionDto> prevPeriodTxs = allTransactions.stream()
                .filter(tx -> !tx.transactionDate().isBefore(prevStartDate) && tx.transactionDate().isBefore(startDate))
                .toList();

        BigDecimal totalSavings = calculateSavings(currentPeriodTxs);
        BigDecimal prevSavings = calculateSavings(prevPeriodTxs);
        BigDecimal periodSpending = calculateSpending(currentPeriodTxs);
        BigDecimal prevSpending = calculateSpending(prevPeriodTxs);

        BigDecimal totalAssets = allTransactions.stream()
                .map(t -> t.amount() != null ? t.amount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> categoryMap = new HashMap<>();
        for (MockBankTransactionDto tx : currentPeriodTxs) {
            if (tx.amount().compareTo(BigDecimal.ZERO) < 0) {
                categoryMap.merge(tx.category(), tx.amount().abs(), BigDecimal::add);
            }
        }

        List<AnalyticsResponse.MonthlyTrend> chartData = buildChartData(currentPeriodTxs, timeframe, startDate);

        String savingsTrend = calculateTrendPercentage(totalSavings, prevSavings);
        String spendingTrend = calculateTrendPercentage(periodSpending, prevSpending);

        List<AnalyticsResponse.CategoryStat> categories = buildCategoryStats(categoryMap, periodSpending);

        return new AnalyticsResponse(
                totalSavings,
                periodSpending,
                totalAssets,
                totalAssets.multiply(new BigDecimal("0.10")).setScale(2, RoundingMode.HALF_UP),
                savingsTrend,
                spendingTrend,
                totalSavings.compareTo(prevSavings) >= 0,
                periodSpending.compareTo(prevSpending) <= 0,
                chartData,
                categories,
                currentPeriodTxs.stream().limit(10).toList()
        );
    }

    private LocalDate getStartDate(LocalDate now, String timeframe) {
        return switch (timeframe) {
            case "Weekly" -> now.minusDays(6);
            case "Yearly" -> now.withDayOfYear(1);
            default -> now.minusDays(27); // 4 full weeks
        };
    }

    private LocalDate getPreviousPeriodStartDate(LocalDate startDate, String timeframe) {
        return switch (timeframe) {
            case "Weekly" -> startDate.minusDays(7);
            case "Yearly" -> startDate.minusYears(1);
            default -> startDate.minusDays(28);
        };
    }

    private BigDecimal calculateSavings(List<MockBankTransactionDto> txs) {
        return txs.stream().map(MockBankTransactionDto::amount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateSpending(List<MockBankTransactionDto> txs) {
        return txs.stream()
                .map(MockBankTransactionDto::amount)
                .filter(a -> a.compareTo(BigDecimal.ZERO) < 0)
                .map(BigDecimal::abs)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String calculateTrendPercentage(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) return "+0%";
        BigDecimal diff = current.subtract(previous);
        BigDecimal percent = diff.multiply(new BigDecimal(100)).divide(previous.abs(), 1, RoundingMode.HALF_UP);
        return (percent.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "") + percent + "%";
    }

    private List<AnalyticsResponse.MonthlyTrend> buildChartData(List<MockBankTransactionDto> txs, String timeframe, LocalDate start) {
        Map<String, BigDecimal> trendMap = new LinkedHashMap<>();
        
        if (timeframe.equals("Weekly")) {
            for (int i = 0; i < 7; i++) trendMap.put(start.plusDays(i).getDayOfWeek().toString().substring(0, 3), BigDecimal.ZERO);
        } else if (timeframe.equals("Yearly")) {
            String[] months = {"JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"};
            for (String m : months) trendMap.put(m, BigDecimal.ZERO);
        } else {
            // Monthly - 4 Weeks with date ranges
            for (int i = 0; i < 4; i++) {
                LocalDate wStart = start.plusDays(i * 7);
                LocalDate wEnd = wStart.plusDays(6);
                String label = wStart.getDayOfMonth() + "-" + wEnd.getDayOfMonth() + " " + wStart.getMonth().toString().substring(0,3);
                trendMap.put(label, BigDecimal.ZERO);
            }
        }

        for (MockBankTransactionDto tx : txs) {
            if (tx.amount().compareTo(BigDecimal.ZERO) < 0) {
                String key = getTrendKey(tx.transactionDate(), timeframe, start);
                trendMap.merge(key, tx.amount().abs(), BigDecimal::add);
            }
        }

        return trendMap.entrySet().stream()
                .map(e -> new AnalyticsResponse.MonthlyTrend(e.getKey(), e.getValue()))
                .toList();
    }

    private String getTrendKey(LocalDate date, String timeframe, LocalDate start) {
        if (timeframe.equals("Weekly")) return date.getDayOfWeek().toString().substring(0, 3);
        if (timeframe.equals("Yearly")) return date.getMonth().toString().substring(0, 3);
        
        // Monthly date range matching
        int weekIdx = (int) (java.time.temporal.ChronoUnit.DAYS.between(start, date) / 7);
        if (weekIdx > 3) weekIdx = 3;
        LocalDate wStart = start.plusDays(weekIdx * 7);
        LocalDate wEnd = wStart.plusDays(6);
        return wStart.getDayOfMonth() + "-" + wEnd.getDayOfMonth() + " " + wStart.getMonth().toString().substring(0,3);
    }

    private List<AnalyticsResponse.CategoryStat> buildCategoryStats(Map<String, BigDecimal> categoryMap, BigDecimal total) {
        List<String> colors = List.of("#10b981", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899");
        int colorIdx = 0;
        List<AnalyticsResponse.CategoryStat> stats = new ArrayList<>();
        BigDecimal divisor = total.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ONE : total;

        for (Map.Entry<String, BigDecimal> entry : categoryMap.entrySet()) {
            BigDecimal percent = entry.getValue().multiply(new BigDecimal(100)).divide(divisor, 1, RoundingMode.HALF_UP);
            stats.add(new AnalyticsResponse.CategoryStat(entry.getKey(), percent, colors.get(colorIdx++ % colors.size())));
        }
        return stats;
    }
}
