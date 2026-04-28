package com.fintrack.mockbank.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class CardNotFoundException extends RuntimeException {
    public CardNotFoundException(String cardNumber) {
        super("Card not found in the banking system: " + cardNumber);
    }
}
