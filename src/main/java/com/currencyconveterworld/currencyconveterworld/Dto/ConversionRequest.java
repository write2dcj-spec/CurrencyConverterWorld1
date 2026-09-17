package com.currencyconveterworld.currencyconveterworld.Dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ConversionRequest {

    private BigDecimal amount;

    private String fromCurrency;

    private String toCurrency;
}

