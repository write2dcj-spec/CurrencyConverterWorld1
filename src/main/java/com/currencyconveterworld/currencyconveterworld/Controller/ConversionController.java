package com.currencyconveterworld.currencyconveterworld.Controller;

import com.currencyconveterworld.currencyconveterworld.Dto.ConversionHistoryResponse;
import com.currencyconveterworld.currencyconveterworld.Dto.ConversionRequest;
import com.currencyconveterworld.currencyconveterworld.Dto.ConversionResponse;
import com.currencyconveterworld.currencyconveterworld.Services.ConversionHistoryService;
import com.currencyconveterworld.currencyconveterworld.Services.ConversionService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/conversions")
@RequiredArgsConstructor
public class ConversionController {

    private final ConversionService conversionService;

    private final ConversionHistoryService conversionHistoryService;


    // =========================================
    // CONVERT CURRENCY
    //
    // Guest user:
    // - conversion works
    // - history is NOT saved
    //
    // Logged-in user:
    // - conversion works
    // - history IS saved
    // =========================================

    @PostMapping
    public ResponseEntity<ConversionResponse> convert(
            @RequestBody ConversionRequest request,
            Authentication authentication) {


        String email = null;


        // =====================================
        // CHECK IF USER IS LOGGED IN
        // =====================================

        if (
                authentication != null &&
                        authentication.isAuthenticated() &&
                        !"anonymousUser".equals(
                                authentication.getName()
                        )
        ) {

            email = authentication.getName();
        }


        // =====================================
        // CONVERT
        // =====================================

        ConversionResponse response =
                conversionService.convert(
                        request,
                        email
                );


        return ResponseEntity.ok(response);
    }


    // =========================================
    // LOGGED-IN USER CONVERSION HISTORY
    //
    // Example:
    //
    // /api/conversions/history?page=0&size=10
    //
    // This endpoint stays protected
    // by SecurityConfig.
    // =========================================

    @GetMapping("/history")
    public ResponseEntity<Page<ConversionHistoryResponse>>
    getHistory(

            Authentication authentication,

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "10"
            )
            int size
    ) {


        // =====================================
        // GET LOGGED-IN USER EMAIL
        // =====================================

        String email =
                authentication.getName();


        // =====================================
        // GET PAGINATED HISTORY
        // =====================================

        Page<ConversionHistoryResponse> history =
                conversionHistoryService
                        .getHistoryByUserEmail(
                                email,
                                page,
                                size
                        );


        return ResponseEntity.ok(history);
    }
}