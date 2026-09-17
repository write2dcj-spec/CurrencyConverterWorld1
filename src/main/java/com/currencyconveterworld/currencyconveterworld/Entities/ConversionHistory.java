package com.currencyconveterworld.currencyconveterworld.Entities;

import com.currencyconveterworld.currencyconveterworld.Entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "conversion_history")
public class ConversionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String fromCurrency;

    private String toCurrency;

    private BigDecimal amount;

    private BigDecimal convertedAmount;

    private BigDecimal rateUsed;

    private LocalDateTime createdAt;
}

