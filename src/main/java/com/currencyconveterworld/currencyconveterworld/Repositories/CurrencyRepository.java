package com.currencyconveterworld.currencyconveterworld.Repositories;

import com.currencyconveterworld.currencyconveterworld.Entities.Currency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CurrencyRepository
        extends JpaRepository<Currency, Long> {


    // Find currency using code
    // Example: USD, INR, EUR
    Optional<Currency> findByCode(String code);


    // Case-insensitive lookup
    // USD / usd / Usd will all work
    Optional<Currency> findByCodeIgnoreCase(String code);


    // Used while synchronizing currencies
    // so we don't create duplicate currency codes
    boolean existsByCodeIgnoreCase(String code);
}