package com.fintrack.backend.dto;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        BigDecimal totalBalance,
        BigDecimal monthlyIncome,
        BigDecimal monthlyExpenses,
        String balanceTrend,
        String incomeTrend,
        String expenseTrend,
        boolean balancePositive,
        boolean incomePositive,
        boolean expensePositive
) {}
