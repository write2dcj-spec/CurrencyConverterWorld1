package com.currencyconveterworld.currencyconveterworld.Services;

import com.currencyconveterworld.currencyconveterworld.Dto.ConversionRequest;
import com.currencyconveterworld.currencyconveterworld.Dto.ConversionResponse;
import com.currencyconveterworld.currencyconveterworld.Entities.ConversionHistory;
import com.currencyconveterworld.currencyconveterworld.Entities.Currency;
import com.currencyconveterworld.currencyconveterworld.Entities.ExchangeRate;
import com.currencyconveterworld.currencyconveterworld.Entities.User;
import com.currencyconveterworld.currencyconveterworld.Repositories.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class ConversionService {

    private final CurrencyService currencyService;

    private final ExchangeRateService exchangeRateService;

    private final ConversionHistoryService conversionHistoryService;

    private final UserRepository userRepository;


    // =====================================================
    // CONVERT CURRENCY
    //
    // Guest:
    // - conversion works
    // - history is NOT saved
    //
    // Logged-in user:
    // - conversion works
    // - history IS saved
    // =====================================================

    public ConversionResponse convert(
            ConversionRequest request,
            String email) {


        // =========================================
        // 1. VALIDATE CURRENCIES
        // =========================================

        Currency fromCurrency =
                currencyService.getCurrencyByCode(
                        request.getFromCurrency()
                );


        Currency toCurrency =
                currencyService.getCurrencyByCode(
                        request.getToCurrency()
                );


        // =========================================
        // 2. FETCH LATEST AVAILABLE EXCHANGE RATE
        // =========================================

        ExchangeRate exchangeRate =
                exchangeRateService.getExchangeRate(
                        fromCurrency.getCode(),
                        toCurrency.getCode()
                );


        // =========================================
        // 3. CALCULATE CONVERTED AMOUNT
        // =========================================

        BigDecimal convertedAmount =
                request.getAmount()
                        .multiply(
                                exchangeRate.getRate()
                        );


        // =========================================
        // 4. SAVE HISTORY ONLY IF USER IS LOGGED IN
        // =========================================

        if (
                email != null &&
                        !email.isBlank()
        ) {


            // =====================================
            // FIND LOGGED-IN USER
            // =====================================

            User user =
                    userRepository
                            .findByEmailIgnoreCase(
                                    email
                            )
                            .orElseThrow(
                                    () ->
                                            new RuntimeException(
                                                    "Logged-in user not found"
                                            )
                            );


            // =====================================
            // CREATE HISTORY
            // =====================================

            ConversionHistory conversionHistory =
                    new ConversionHistory();


            conversionHistory.setFromCurrency(
                    fromCurrency.getCode()
            );


            conversionHistory.setToCurrency(
                    toCurrency.getCode()
            );


            conversionHistory.setAmount(
                    request.getAmount()
            );


            conversionHistory.setConvertedAmount(
                    convertedAmount
            );


            conversionHistory.setRateUsed(
                    exchangeRate.getRate()
            );


            conversionHistory.setCreatedAt(
                    LocalDateTime.now()
            );


            conversionHistory.setUser(
                    user
            );


            // =====================================
            // SAVE HISTORY
            // =====================================

            conversionHistoryService.save(
                    conversionHistory
            );
        }


        // =========================================
        // 5. BUILD RESPONSE
        //
        // Guest and logged-in user both receive:
        //
        // - conversion result
        // - exchange rate
        // - source
        // - provider rate date
        // - fetched time
        // =========================================

        return ConversionResponse
                .builder()

                .amount(
                        request.getAmount()
                )

                .fromCurrency(
                        fromCurrency.getCode()
                )

                .toCurrency(
                        toCurrency.getCode()
                )

                .exchangeRate(
                        exchangeRate.getRate()
                )

                .convertedAmount(
                        convertedAmount
                )

                // =================================
                // RATE SOURCE
                // =================================

                .source(
                        exchangeRate.getSource()
                )

                // =================================
                // PROVIDER RATE DATE
                // =================================

                .rateDate(
                        exchangeRate.getRateDate()
                )

                // =================================
                // WHEN OUR APP FETCHED THE RATE
                // =================================

                .fetchedAt(
                        exchangeRate.getUpdatedAt()
                )

                .build();
    }
}