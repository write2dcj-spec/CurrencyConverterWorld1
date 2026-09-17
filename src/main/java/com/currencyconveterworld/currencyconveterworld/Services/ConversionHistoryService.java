package com.currencyconveterworld.currencyconveterworld.Services;

import com.currencyconveterworld.currencyconveterworld.Dto.ConversionHistoryResponse;
import com.currencyconveterworld.currencyconveterworld.Entities.ConversionHistory;
import com.currencyconveterworld.currencyconveterworld.Entities.User;
import com.currencyconveterworld.currencyconveterworld.Repositories.ConversionHistoryRepository;
import com.currencyconveterworld.currencyconveterworld.Repositories.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class ConversionHistoryService {

    private final ConversionHistoryRepository
            conversionHistoryRepository;

    private final UserRepository
            userRepository;


    // ==========================================
    // SAVE CONVERSION HISTORY
    // ==========================================

    public ConversionHistory save(
            ConversionHistory conversionHistory) {

        return conversionHistoryRepository
                .save(conversionHistory);
    }


    // ==========================================
    // GET PAGINATED USER HISTORY
    // ==========================================

    public Page<ConversionHistoryResponse>
    getHistoryByUserEmail(
            String email,
            int page,
            int size) {


        // ======================================
        // VALIDATE PAGE
        // ======================================

        if (page < 0) {

            page = 0;
        }


        // ======================================
        // VALIDATE PAGE SIZE
        //
        // Prevent extremely large requests.
        // ======================================

        if (size < 1) {

            size = 10;
        }


        if (size > 100) {

            size = 100;
        }


        // ======================================
        // FIND LOGGED-IN USER
        // ======================================

        User user =
                userRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        // ======================================
        // PAGINATION
        //
        // Newest conversion first.
        // ======================================

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(
                                Sort.Direction.DESC,
                                "createdAt"
                        )
                );


        // ======================================
        // GET HISTORY FROM DATABASE
        // ======================================

        Page<ConversionHistory>
                historyPage =
                conversionHistoryRepository
                        .findByUser(
                                user,
                                pageable
                        );


        // ======================================
        // ENTITY → RESPONSE DTO
        // ======================================

        return historyPage.map(
                history ->
                        new ConversionHistoryResponse(

                                history.getId(),

                                history.getFromCurrency(),

                                history.getToCurrency(),

                                history.getAmount(),

                                history.getConvertedAmount(),

                                history.getRateUsed(),

                                history.getCreatedAt()
                        )
        );
    }
}