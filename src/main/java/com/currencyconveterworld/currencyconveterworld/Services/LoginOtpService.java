package com.currencyconveterworld.currencyconveterworld.Services;

import com.currencyconveterworld.currencyconveterworld.Dto.LoginResponse;
import com.currencyconveterworld.currencyconveterworld.Entities.LoginOtp;
import com.currencyconveterworld.currencyconveterworld.Entities.User;
import com.currencyconveterworld.currencyconveterworld.Repositories.LoginOtpRepository;
import com.currencyconveterworld.currencyconveterworld.Repositories.UserRepository;
import com.currencyconveterworld.currencyconveterworld.Security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LoginOtpService {

    private final LoginOtpRepository loginOtpRepository;

    private final UserRepository userRepository;

    private final EmailService emailService;

    private final JwtService jwtService;

    private final SecureRandom secureRandom =
            new SecureRandom();


    // =========================================
    // SEND OTP
    // EMAIL -> Gmail
    // MOBILE -> Console (Development)
    // =========================================

    @Transactional
    public void sendOtp(String identifier) {

        if (identifier == null ||
                identifier.isBlank()) {

            throw new RuntimeException(
                    "Email or mobile number is required"
            );
        }

        String value = identifier.trim();

        // =====================================
        // EMAIL OTP
        // =====================================

        if (value.contains("@")) {

            String email =
                    value.toLowerCase();

            User user = userRepository
                    .findByEmailIgnoreCase(email)
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "No account found with this email"
                            )
                    );

            if (!Boolean.TRUE.equals(user.getEnabled())) {

                throw new RuntimeException(
                        "Account is disabled"
                );
            }

            String otp = generateOtp();

            LoginOtp loginOtp =
                    createOtp(
                            email,
                            otp,
                            "EMAIL"
                    );

            loginOtpRepository.save(
                    loginOtp
            );

            emailService.sendLoginOtp(
                    email,
                    otp
            );

            return;
        }


        // =====================================
        // MOBILE OTP
        // =====================================

        String mobileNumber =
                normalizeMobile(value);

        User user = userRepository
                .findByMobileNumber(mobileNumber)
                .orElseThrow(
                        () -> new RuntimeException(
                                "No account found with this mobile number"
                        )
                );

        if (!Boolean.TRUE.equals(user.getEnabled())) {

            throw new RuntimeException(
                    "Account is disabled"
            );
        }

        String otp = generateOtp();

        LoginOtp loginOtp =
                createOtp(
                        mobileNumber,
                        otp,
                        "MOBILE"
                );

        loginOtpRepository.save(
                loginOtp
        );


        // =====================================
        // DEVELOPMENT ONLY
        // Later replace this with SMS provider
        // =====================================

        System.out.println(
                "========================================="
        );

        System.out.println(
                "MOBILE LOGIN OTP"
        );

        System.out.println(
                "Mobile: " + mobileNumber
        );

        System.out.println(
                "OTP: " + otp
        );

        System.out.println(
                "Valid for: 5 minutes"
        );

        System.out.println(
                "========================================="
        );
    }


    // =========================================
    // VERIFY OTP
    // =========================================

    @Transactional
    public LoginResponse verifyOtp(
            String identifier,
            String otp) {

        if (identifier == null ||
                identifier.isBlank()) {

            throw new RuntimeException(
                    "Email or mobile number is required"
            );
        }

        if (otp == null ||
                otp.isBlank()) {

            throw new RuntimeException(
                    "OTP is required"
            );
        }

        String value =
                identifier.trim();

        String normalizedIdentifier;

        String type;


        // =====================================
        // DETECT EMAIL OR MOBILE
        // =====================================

        if (value.contains("@")) {

            normalizedIdentifier =
                    value.toLowerCase();

            type = "EMAIL";

        } else {

            normalizedIdentifier =
                    normalizeMobile(value);

            type = "MOBILE";
        }


        // =====================================
        // FIND LATEST UNUSED OTP
        // =====================================

        LoginOtp loginOtp =
                loginOtpRepository
                        .findTopByIdentifierAndTypeAndUsedFalseOrderByCreatedAtDesc(
                                normalizedIdentifier,
                                type
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "OTP not found. Please request a new OTP."
                                )
                        );


        // =====================================
        // CHECK EXPIRY
        // =====================================

        if (loginOtp.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }


        // =====================================
        // CHECK ATTEMPTS
        // =====================================

        if (loginOtp.getAttempts() >= 5) {

            throw new RuntimeException(
                    "Too many incorrect attempts. Please request a new OTP."
            );
        }


        // =====================================
        // CHECK OTP
        // =====================================

        if (!loginOtp.getOtp()
                .equals(otp.trim())) {

            loginOtp.setAttempts(
                    loginOtp.getAttempts() + 1
            );

            loginOtpRepository.save(
                    loginOtp
            );

            throw new RuntimeException(
                    "Invalid OTP"
            );
        }


        // =====================================
        // OTP SUCCESS
        // =====================================

        loginOtp.setUsed(true);

        loginOtpRepository.save(
                loginOtp
        );


        User user;


        // =====================================
        // EMAIL USER
        // =====================================

        if ("EMAIL".equals(type)) {

            user = userRepository
                    .findByEmailIgnoreCase(
                            normalizedIdentifier
                    )
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "User not found"
                            )
                    );

            user.setEmailVerified(true);
        }


        // =====================================
        // MOBILE USER
        // =====================================

        else {

            user = userRepository
                    .findByMobileNumber(
                            normalizedIdentifier
                    )
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "User not found"
                            )
                    );

            user.setMobileVerified(true);
        }


        userRepository.save(user);


        // =====================================
        // GENERATE JWT
        // =====================================

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return new LoginResponse(token);
    }


    // =========================================
    // CREATE OTP ENTITY
    // =========================================

    private LoginOtp createOtp(
            String identifier,
            String otp,
            String type) {

        LoginOtp loginOtp =
                new LoginOtp();

        loginOtp.setIdentifier(
                identifier
        );

        loginOtp.setOtp(
                otp
        );

        loginOtp.setType(
                type
        );

        loginOtp.setExpiresAt(
                LocalDateTime.now()
                        .plusMinutes(5)
        );

        loginOtp.setUsed(false);

        loginOtp.setAttempts(0);

        loginOtp.setCreatedAt(
                LocalDateTime.now()
        );

        return loginOtp;
    }


    // =========================================
    // NORMALIZE INDIAN MOBILE NUMBER
    // =========================================

    private String normalizeMobile(
            String mobile) {

        if (mobile == null ||
                mobile.isBlank()) {

            throw new RuntimeException(
                    "Mobile number is required"
            );
        }

        String normalized =
                mobile.trim()
                        .replace(" ", "")
                        .replace("-", "");


        // +919876543210
        if (normalized.startsWith("+91")) {

            normalized =
                    normalized.substring(3);
        }


        // 919876543210
        else if (normalized.startsWith("91")
                && normalized.length() == 12) {

            normalized =
                    normalized.substring(2);
        }


        // Validate Indian mobile number
        if (!normalized.matches(
                "[6-9][0-9]{9}"
        )) {

            throw new RuntimeException(
                    "Please enter a valid 10-digit mobile number"
            );
        }

        return normalized;
    }


    // =========================================
    // GENERATE 6 DIGIT OTP
    // =========================================

    private String generateOtp() {

        int number =
                100000 +
                        secureRandom.nextInt(900000);

        return String.valueOf(number);
    }
}