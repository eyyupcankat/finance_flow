package com.fintrack.backend.controller;

import com.fintrack.backend.dto.DashboardSummaryResponse;
import com.fintrack.backend.dto.mockbank.MockBankTransactionDto;
import com.fintrack.backend.security.UserPrincipal;
import com.fintrack.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getSummary(principal.getId()));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<MockBankTransactionDto>> getRecentTransactions(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getRecentTransactions(principal.getId()));
    }
}
