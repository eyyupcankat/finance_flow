package com.fintrack.backend.controller;

import com.fintrack.backend.dto.SubscriptionResponse;
import com.fintrack.backend.entity.SubscriptionStatus;
import com.fintrack.backend.repository.SubscriptionRepository;
import com.fintrack.backend.security.UserPrincipal;
import com.fintrack.backend.service.SubscriptionAnalysisService;
import com.fintrack.backend.service.SubscriptionCancellationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionAnalysisService analysisService;
    private final SubscriptionCancellationService cancellationService;
    private final SubscriptionRepository subscriptionRepository;

    @GetMapping
    public ResponseEntity<List<SubscriptionResponse>> getSubscriptions(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) SubscriptionStatus status) {
        List<SubscriptionResponse> result = (status != null)
                ? subscriptionRepository.findByUserIdAndStatus(principal.getId(), status)
                        .stream().map(SubscriptionResponse::from).toList()
                : subscriptionRepository.findByUserId(principal.getId())
                        .stream().map(SubscriptionResponse::from).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/detect/{cardId}")
    public ResponseEntity<List<SubscriptionResponse>> detectSubscriptions(@AuthenticationPrincipal UserPrincipal principal,
                                                                          @PathVariable Long cardId) {
        return ResponseEntity.ok(analysisService.analyzeCard(cardId, principal.getId()));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<SubscriptionResponse> cancelSubscription(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @PathVariable Long id) {
        return ResponseEntity.ok(cancellationService.cancelSubscription(id, principal.getId()));
    }
}
