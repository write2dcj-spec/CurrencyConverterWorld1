package com.currencyconveterworld.currencyconveterworld.Controller;

import com.currencyconveterworld.currencyconveterworld.Entities.Currency;
import com.currencyconveterworld.currencyconveterworld.Services.CurrencyService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/currencies")
@RequiredArgsConstructor
public class CurrencyController {

    private final CurrencyService currencyService;


    // =====================================================
    // GET ALL ACTIVE CURRENCIES
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Currency>>
    getAllCurrencies() {

        return ResponseEntity.ok(
                currencyService
                        .getAllActiveCurrencies()
        );
    }


    // =====================================================
    // SYNCHRONIZE CURRENCIES
    //
    // Development endpoint.
    // We can automate/remove/protect this later.
    // =====================================================

    @PostMapping("/sync")
    public ResponseEntity<?> synchronizeCurrencies() {

        try {

            int count =
                    currencyService
                            .synchronizeCurrencies();


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Currencies synchronized successfully",

                            "count",
                            count
                    )
            );


        } catch (RuntimeException e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}