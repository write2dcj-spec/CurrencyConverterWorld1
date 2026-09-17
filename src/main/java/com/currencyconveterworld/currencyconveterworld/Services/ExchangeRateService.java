package com.currencyconveterworld.currencyconveterworld.Services;

import com.currencyconveterworld.currencyconveterworld.Entities.ExchangeRate;
import com.currencyconveterworld.currencyconveterworld.Repositories.ExchangeRateRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class ExchangeRateService {

    private final ExchangeRateRepository exchangeRateRepository;


    // =====================================================
    // GET LATEST AVAILABLE EXCHANGE RATE
    // =====================================================

    public ExchangeRate getExchangeRate(
            String baseCurrency,
            String targetCurrency) {


        // =================================================
        // VALIDATE CURRENCY CODES
        // =================================================

        if (
                baseCurrency == null ||
                        baseCurrency.isBlank() ||
                        targetCurrency == null ||
                        targetCurrency.isBlank()
        ) {

            throw new RuntimeException(
                    "Base currency and target currency are required"
            );
        }


        String base =
                baseCurrency
                        .trim()
                        .toUpperCase();


        String target =
                targetCurrency
                        .trim()
                        .toUpperCase();


        // =================================================
        // SAME CURRENCY
        // Example: USD -> USD = 1
        // =================================================

        if (base.equals(target)) {

            ExchangeRate exchangeRate =
                    exchangeRateRepository
                            .findByBaseCurrencyAndTargetCurrency(
                                    base,
                                    target
                            )
                            .orElse(
                                    new ExchangeRate()
                            );


            exchangeRate.setBaseCurrency(
                    base
            );

            exchangeRate.setTargetCurrency(
                    target
            );

            exchangeRate.setRate(
                    BigDecimal.ONE
            );

            exchangeRate.setSource(
                    "SAME_CURRENCY"
            );


            // Same currency does not require provider data.
            exchangeRate.setRateDate(
                    LocalDate.now()
            );


            exchangeRate.setUpdatedAt(
                    LocalDateTime.now()
            );


            return exchangeRateRepository.save(
                    exchangeRate
            );
        }


        // =================================================
        // ALWAYS REQUEST LATEST AVAILABLE PROVIDER RATE
        // =================================================

        try {

            String apiUrl =
                    "https://api.frankfurter.dev/v2/rate/"
                            + base
                            + "/"
                            + target;


            RestTemplate restTemplate =
                    new RestTemplate();


            // =================================================
            // CALL FRANKFURTER
            // =================================================

            Map<?, ?> response =
                    restTemplate.getForObject(
                            apiUrl,
                            Map.class
                    );


            // =================================================
            // VALIDATE RESPONSE
            // =================================================

            if (response == null) {

                throw new RuntimeException(
                        "No response received from exchange rate provider"
                );
            }


            // =================================================
            // READ RATE
            // =================================================

            Object rateObject =
                    response.get(
                            "rate"
                    );


            if (rateObject == null) {

                throw new RuntimeException(
                        "Latest exchange rate was not returned by provider"
                );
            }


            BigDecimal latestRate =
                    new BigDecimal(
                            rateObject.toString()
                    );


            if (
                    latestRate.compareTo(
                            BigDecimal.ZERO
                    ) <= 0
            ) {

                throw new RuntimeException(
                        "Invalid exchange rate received from provider"
                );
            }


            // =================================================
            // READ PROVIDER RATE DATE
            // =================================================

            Object dateObject =
                    response.get(
                            "date"
                    );


            if (dateObject == null) {

                throw new RuntimeException(
                        "Exchange rate date was not returned by provider"
                );
            }


            LocalDate rateDate =
                    LocalDate.parse(
                            dateObject.toString()
                    );


            // =================================================
            // FIND EXISTING DATABASE RATE
            // =================================================

            ExchangeRate exchangeRate =
                    exchangeRateRepository
                            .findByBaseCurrencyAndTargetCurrency(
                                    base,
                                    target
                            )
                            .orElse(
                                    new ExchangeRate()
                            );


            // =================================================
            // UPDATE DATABASE
            // =================================================

            exchangeRate.setBaseCurrency(
                    base
            );

            exchangeRate.setTargetCurrency(
                    target
            );

            exchangeRate.setRate(
                    latestRate
            );

            exchangeRate.setSource(
                    "FRANKFURTER"
            );


            // Date associated with provider's rate.
            exchangeRate.setRateDate(
                    rateDate
            );


            // Exact time OUR application fetched the rate.
            exchangeRate.setUpdatedAt(
                    LocalDateTime.now()
            );


            ExchangeRate savedExchangeRate =
                    exchangeRateRepository.save(
                            exchangeRate
                    );


            // =================================================
            // DEVELOPMENT LOG
            // =================================================

            System.out.println(
                    "Latest available exchange rate fetched: "
                            + base
                            + " -> "
                            + target
                            + " = "
                            + latestRate
                            + " | Rate Date: "
                            + rateDate
                            + " | Fetched At: "
                            + savedExchangeRate.getUpdatedAt()
            );


            return savedExchangeRate;


        } catch (Exception e) {


            // =================================================
            // IMPORTANT
            //
            // NEVER FALL BACK TO OLD DATABASE RATE.
            // =================================================

            System.out.println(
                    "Exchange rate provider failed for "
                            + base
                            + " -> "
                            + target
                            + ": "
                            + e.getMessage()
            );


            throw new RuntimeException(
                    "Latest exchange rate is temporarily unavailable. "
                            + "Please try again shortly."
            );
        }
    }
}