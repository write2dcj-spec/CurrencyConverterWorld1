package com.currencyconveterworld.currencyconveterworld.Repositories;

import com.currencyconveterworld.currencyconveterworld.Entities.ConversionHistory;
import com.currencyconveterworld.currencyconveterworld.Entities.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversionHistoryRepository
        extends JpaRepository<ConversionHistory, Long> {

    Page<ConversionHistory>
    findByUser(
            User user,
            Pageable pageable
    );
}