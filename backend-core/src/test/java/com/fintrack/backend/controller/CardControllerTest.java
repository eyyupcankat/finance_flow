package com.fintrack.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintrack.backend.dto.CardRequest;
import com.fintrack.backend.dto.CardResponse;
import com.fintrack.backend.security.UserPrincipal;
import com.fintrack.backend.service.CardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CardControllerTest {

    @Mock
    private CardService cardService;

    @InjectMocks
    private CardController cardController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(cardController)
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
    void getCards_success() throws Exception {
        CardResponse card = new CardResponse(1L, "4111000000000000", "Main", LocalDateTime.now());
        when(cardService.getCards(1L)).thenReturn(List.of(card));

        mockMvc.perform(get("/api/cards"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].cardNumber").value("4111000000000000"));
    }

    @Test
    void addCard_success() throws Exception {
        CardRequest request = new CardRequest("4111000000000000", "Main");
        CardResponse response = new CardResponse(1L, "4111000000000000", "Main", LocalDateTime.now());

        when(cardService.addCard(eq(1L), any(CardRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/cards")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.cardNumber").value("4111000000000000"));
    }

    @Test
    void deleteCard_success() throws Exception {
        mockMvc.perform(delete("/api/cards/1"))
                .andExpect(status().isNoContent());

        verify(cardService).deleteCard(1L, 1L);
    }
}
