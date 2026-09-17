package com.currencyconveterworld.currencyconveterworld.Entities;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exchange_rates")
public class ExchangeRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // CURRENCY PAIR
    // ==========================================

    private String baseCurrency;

    private String targetCurrency;


    // ==========================================
    // EXCHANGE RATE
    // ==========================================

    private BigDecimal rate;


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
    //
    // This is the date associated with the rate
    // returned by the exchange-rate provider.
    // ==========================================

    private LocalDate rateDate;


    // ==========================================
    // FETCHED / UPDATED TIME
    //
    // This is when OUR application fetched
    // and saved the rate.
    // ==========================================

    private LocalDateTime updatedAt;
}