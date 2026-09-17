package com.currencyconveterworld.currencyconveterworld.Repositories;


import com.currencyconveterworld.currencyconveterworld.Entities.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {
    Optional<ExchangeRate> findByBaseCurrencyAndTargetCurrency( //NullPointerException
                                                                String baseCurrency,
                                                                String targetCurrency
    );
}