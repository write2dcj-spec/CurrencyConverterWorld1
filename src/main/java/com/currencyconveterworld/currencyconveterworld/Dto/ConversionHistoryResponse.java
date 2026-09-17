package com.currencyconveterworld.currencyconveterworld.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ConversionHistoryResponse {

    private Long id;

    private String fromCurrency;

    private String toCurrency;

    private BigDecimal amount;

    private BigDecimal convertedAmount;

    private BigDecimal rateUsed;

    private LocalDateTime createdAt;
}