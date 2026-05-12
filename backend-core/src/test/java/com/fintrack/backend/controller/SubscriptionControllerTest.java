package com.fintrack.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintrack.backend.dto.SubscriptionResponse;
import com.fintrack.backend.entity.Subscription;
import com.fintrack.backend.entity.SubscriptionStatus;
import com.fintrack.backend.entity.VirtualCard;
import com.fintrack.backend.repository.SubscriptionRepository;
import com.fintrack.backend.security.UserPrincipal;
import com.fintrack.backend.service.SubscriptionAnalysisService;
import com.fintrack.backend.service.SubscriptionCancellationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class SubscriptionControllerTest {

    @Mock
    private SubscriptionAnalysisService analysisService;

    @Mock
    private SubscriptionCancellationService cancellationService;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @InjectMocks
    private SubscriptionController subscriptionController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(subscriptionController)
                .setCustomArgumentResolvers(new HandlerMethodArgumentResolver() {
                    @Override
                    public boolean supportsParameter(MethodParameter parameter) {
                        return parameter.getParameterType().isAssignableFrom(UserPrincipal.class);
                    }

                    @Override
                    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
                        return new UserPrincipal(1L, "test@example.com", "password");
                    }
                })
                .build();
    }

    @Test
    void getSubscriptions_success() throws Exception {
        VirtualCard card = new VirtualCard();
        card.setId(10L);

        Subscription sub = Subscription.builder()
                .id(1L).name("Netflix").amount(BigDecimal.valueOf(9.99))
                .currency("USD").billingCycle("MONTHLY").status(SubscriptionStatus.ACTIVE)
                .detectedAt(LocalDateTime.now())
                .card(card)
                .build();

        when(subscriptionRepository.findByUserId(1L)).thenReturn(List.of(sub));

        mockMvc.perform(get("/api/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Netflix"))
                .andExpect(jsonPath("$[0].cardId").value(10));
    }

    @Test
    void detectSubscriptions_success() throws Exception {
        SubscriptionResponse response = new SubscriptionResponse(1L, "Netflix", BigDecimal.valueOf(9.99), "USD", "MONTHLY", LocalDateTime.now(), SubscriptionStatus.ACTIVE, 10L);
        when(analysisService.analyzeCard(10L, 1L)).thenReturn(List.of(response));

        mockMvc.perform(post("/api/subscriptions/detect/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Netflix"))
                .andExpect(jsonPath("$[0].cardId").value(10));
    }

    @Test
    void cancelSubscription_success() throws Exception {
        SubscriptionResponse response = new SubscriptionResponse(1L, "Netflix", BigDecimal.valueOf(9.99), "USD", "MONTHLY", LocalDateTime.now(), SubscriptionStatus.CANCELLED, 10L);
        when(cancellationService.cancelSubscription(1L, 1L)).thenReturn(response);

        mockMvc.perform(post("/api/subscriptions/1/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }
}
