package com.currencyconveterworld.currencyconveterworld.Repositories;

import com.currencyconveterworld.currencyconveterworld.Entities.LoginOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginOtpRepository extends JpaRepository<LoginOtp, Long> {

    Optional<LoginOtp> findTopByIdentifierAndTypeAndUsedFalseOrderByCreatedAtDesc(
            String identifier,
            String type
    );
}