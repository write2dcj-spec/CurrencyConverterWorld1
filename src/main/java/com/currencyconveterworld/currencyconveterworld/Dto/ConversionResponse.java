package com.currencyconveterworld.currencyconveterworld.Dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@Builder
public class ConversionResponse {

    // ==========================================
    // ORIGINAL AMOUNT
    // ==========================================

    private BigDecimal amount;


    // ==========================================
    // CURRENCY PAIR
    // ==========================================

    private String fromCurrency;

    private String toCurrency;


    // ==========================================
    // EXCHANGE RATE
    // ==========================================

    private BigDecimal exchangeRate;


    // ==========================================
    // CONVERTED AMOUNT
    // ==========================================

    private BigDecimal convertedAmount;


    // ==========================================
    // RATE SOURCE
    //
    // Example:
    // FRANKFURTER
    // SAME_CURRENCY
    // ==========================================

    private String source;


    // ==========================================
    // PROVIDER RATE DATE
    // ==========================================

    private LocalDate rateDate;


    // ==========================================
    // WHEN OUR APPLICATION FETCHED THE RATE
    // ==========================================

    private LocalDateTime fetchedAt;
}