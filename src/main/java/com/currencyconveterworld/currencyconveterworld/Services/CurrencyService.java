package com.currencyconveterworld.currencyconveterworld.Services;

import com.currencyconveterworld.currencyconveterworld.Entities.Currency;
import com.currencyconveterworld.currencyconveterworld.Repositories.CurrencyRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class CurrencyService {

    private final CurrencyRepository currencyRepository;


    private static final String FRANKFURTER_CURRENCIES_URL =
            "https://api.frankfurter.dev/v2/currencies";


    // =====================================================
    // GET CURRENCY BY CODE
    // =====================================================

    public Currency getCurrencyByCode(String code) {

        if (code == null || code.isBlank()) {

            throw new RuntimeException(
                    "Currency code is required"
            );
        }


        String normalizedCode =
                code.trim().toUpperCase();


        return currencyRepository
                .findByCodeIgnoreCase(normalizedCode)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Currency not found: "
                                        + normalizedCode
                        )
                );
    }


    // =====================================================
    // GET ALL ACTIVE CURRENCIES
    // =====================================================

    public List<Currency> getAllActiveCurrencies() {

        return currencyRepository
                .findAll()
                .stream()
                .filter(Currency::isActive)
                .sorted(
                        Comparator.comparing(
                                Currency::getCode
                        )
                )
                .toList();
    }


    // =====================================================
    // SYNCHRONIZE CURRENCIES FROM FRANKFURTER
    // =====================================================

    public int synchronizeCurrencies() {

        try {

            RestTemplate restTemplate =
                    new RestTemplate();


            // Frankfurter v2 returns an array of
            // currency objects.
            List response =
                    restTemplate.getForObject(
                            FRANKFURTER_CURRENCIES_URL,
                            List.class
                    );


            if (response == null || response.isEmpty()) {

                throw new RuntimeException(
                        "No currencies received from Frankfurter API"
                );
            }


            int synchronizedCount = 0;


            for (Object item : response) {

                if (!(item instanceof Map)) {
                    continue;
                }


                Map<String, Object> currencyData =
                        (Map<String, Object>) item;


                // ==========================================
                // Read ISO currency code
                // ==========================================

                Object isoCodeObject =
                        currencyData.get("iso_code");


                if (isoCodeObject == null) {
                    continue;
                }


                String code =
                        isoCodeObject
                                .toString()
                                .trim()
                                .toUpperCase();


                if (code.isBlank()) {
                    continue;
                }


                // ==========================================
                // Read currency name
                // ==========================================

                Object nameObject =
                        currencyData.get("name");


                String name =
                        nameObject != null
                                ? nameObject.toString()
                                : code;


                // ==========================================
                // Find existing currency or create new
                // ==========================================

                Currency currency =
                        currencyRepository
                                .findByCodeIgnoreCase(code)
                                .orElseGet(Currency::new);


                boolean isNew =
                        currency.getId() == null;


                // ==========================================
                // Set values
                // ==========================================

                currency.setCode(code);

                currency.setName(name);

                currency.setActive(true);


                // Frankfurter currency-list metadata is
                // not being treated as our authoritative
                // country / flag / symbol database here.
                //
                // Keep existing values if we already
                // manually populated them.

                if (isNew) {

                    currency.setCreatedAt(
                            LocalDateTime.now()
                    );
                }


                currency.setUpdatedAt(
                        LocalDateTime.now()
                );


                // ==========================================
                // Save currency
                // ==========================================

                currencyRepository.save(currency);


                synchronizedCount++;
            }


            System.out.println(
                    "Currency synchronization completed. "
                            + synchronizedCount
                            + " currencies synchronized."
            );


            return synchronizedCount;


        } catch (Exception e) {

            System.out.println(
                    "Currency synchronization failed: "
                            + e.getMessage()
            );


            throw new RuntimeException(
                    "Unable to synchronize currencies",
                    e
            );
        }
    }
}