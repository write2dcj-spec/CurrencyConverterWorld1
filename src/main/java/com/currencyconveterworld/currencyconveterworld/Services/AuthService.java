package com.currencyconveterworld.currencyconveterworld.Services;

import com.currencyconveterworld.currencyconveterworld.Dto.ForgotPasswordRequest;
import com.currencyconveterworld.currencyconveterworld.Dto.LoginRequest;
import com.currencyconveterworld.currencyconveterworld.Dto.LoginResponse;
import com.currencyconveterworld.currencyconveterworld.Dto.RegisterRequest;
import com.currencyconveterworld.currencyconveterworld.Dto.ResetPasswordRequest;
import com.currencyconveterworld.currencyconveterworld.Entities.LoginOtp;
import com.currencyconveterworld.currencyconveterworld.Entities.User;
import com.currencyconveterworld.currencyconveterworld.Repositories.LoginOtpRepository;
import com.currencyconveterworld.currencyconveterworld.Repositories.UserRepository;
import com.currencyconveterworld.currencyconveterworld.Security.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final LoginOtpRepository loginOtpRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final EmailService emailService;

    private final SecureRandom secureRandom =
            new SecureRandom();


    // =========================================
    // REGISTER
    // CREATE DISABLED USER + SEND EMAIL OTP
    // =========================================

    @Transactional
    public LoginResponse register(
            RegisterRequest request) {

        // =====================================
        // NAME VALIDATION
        // =====================================

        if (request.getName() == null ||
                request.getName().isBlank()) {

            throw new RuntimeException(
                    "Name is required"
            );
        }


        // =====================================
        // EMAIL VALIDATION
        // =====================================

        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }


        // =====================================
        // PASSWORD VALIDATION
        // =====================================

        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {

            throw new RuntimeException(
                    "Password is required"
            );
        }


        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // =====================================
        // CHECK EMAIL
        // =====================================

        if (userRepository
                .existsByEmailIgnoreCase(email)) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }


        // =====================================
        // MOBILE
        // OPTIONAL DURING REGISTRATION
        // =====================================

        String mobileNumber =
                normalizeMobile(
                        request.getMobileNumber()
                );


        if (mobileNumber != null &&
                userRepository
                        .existsByMobileNumber(
                                mobileNumber
                        )) {

            throw new RuntimeException(
                    "Mobile number already registered"
            );
        }


        // =====================================
        // CREATE USER
        // =====================================

        User user =
                new User();

        user.setName(
                request.getName().trim()
        );

        user.setEmail(email);

        user.setMobileNumber(
                mobileNumber
        );


        // Never save plain password

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        user.setRole("USER");

        user.setProvider("LOCAL");

        user.setProviderId(null);


        // =====================================
        // ACCOUNT NOT ACTIVE UNTIL OTP VERIFIED
        // =====================================

        user.setEnabled(false);

        user.setEmailVerified(false);

        user.setMobileVerified(false);

        user.setCreatedAt(
                LocalDateTime.now()
        );


        userRepository.save(user);


        // =====================================
        // GENERATE REGISTRATION OTP
        // =====================================

        String otp =
                generateOtp();


        LoginOtp loginOtp =
                new LoginOtp();

        loginOtp.setIdentifier(
                email
        );

        loginOtp.setOtp(
                otp
        );

        loginOtp.setType(
                "REGISTER_EMAIL"
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


        loginOtpRepository.save(
                loginOtp
        );


        // =====================================
        // SEND REGISTRATION OTP
        // =====================================

        emailService.sendRegistrationOtp(
                email,
                otp
        );


        // =====================================
        // NO JWT BEFORE EMAIL VERIFICATION
        // =====================================

        return new LoginResponse(null);
    }


    // =========================================
    // VERIFY REGISTRATION EMAIL OTP
    // =========================================

    @Transactional
    public void verifyRegisterOtp(
            String identifier,
            String otp) {

        if (identifier == null ||
                identifier.isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }


        if (otp == null ||
                otp.isBlank()) {

            throw new RuntimeException(
                    "OTP is required"
            );
        }


        String email =
                identifier
                        .trim()
                        .toLowerCase();


        User user =
                userRepository
                        .findByEmailIgnoreCase(
                                email
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "User not found"
                                        )
                        );


        if (user.isEmailVerified()) {

            throw new RuntimeException(
                    "Email is already verified"
            );
        }


        LoginOtp loginOtp =
                loginOtpRepository
                        .findTopByIdentifierAndTypeAndUsedFalseOrderByCreatedAtDesc(
                                email,
                                "REGISTER_EMAIL"
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "OTP not found or already used"
                                        )
                        );


        // =====================================
        // CHECK EXPIRY
        // =====================================

        if (loginOtp
                .getExpiresAt()
                .isBefore(
                        LocalDateTime.now()
                )) {

            loginOtp.setUsed(true);

            loginOtpRepository.save(
                    loginOtp
            );

            throw new RuntimeException(
                    "OTP has expired"
            );
        }


        // =====================================
        // CHECK ATTEMPTS
        // =====================================

        if (loginOtp.getAttempts() >= 5) {

            loginOtp.setUsed(true);

            loginOtpRepository.save(
                    loginOtp
            );

            throw new RuntimeException(
                    "Too many incorrect OTP attempts"
            );
        }


        // =====================================
        // VERIFY OTP
        // =====================================

        if (!loginOtp
                .getOtp()
                .equals(
                        otp.trim()
                )) {

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


        // =====================================
        // ACTIVATE ACCOUNT
        // =====================================

        user.setEmailVerified(true);

        user.setEnabled(true);

        userRepository.save(user);
    }


    // =========================================
    // PASSWORD LOGIN
    // EMAIL OR MOBILE
    // =========================================

    public LoginResponse login(
            LoginRequest request) {

        if (request.getIdentifier() == null ||
                request.getIdentifier().isBlank()) {

            throw new RuntimeException(
                    "Email or mobile number is required"
            );
        }


        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {

            throw new RuntimeException(
                    "Password is required"
            );
        }


        String identifier =
                request.getIdentifier()
                        .trim();


        User user;


        // =====================================
        // EMAIL LOGIN
        // =====================================

        if (identifier.contains("@")) {

            user =
                    userRepository
                            .findByEmailIgnoreCase(
                                    identifier
                            )
                            .orElseThrow(
                                    () ->
                                            new RuntimeException(
                                                    "Invalid email/mobile or password"
                                            )
                            );

        } else {

            // =================================
            // MOBILE LOGIN
            // =================================

            String mobileNumber =
                    normalizeMobile(
                            identifier
                    );


            user =
                    userRepository
                            .findByMobileNumber(
                                    mobileNumber
                            )
                            .orElseThrow(
                                    () ->
                                            new RuntimeException(
                                                    "Invalid email/mobile or password"
                                            )
                            );
        }


        // =====================================
        // ACCOUNT MUST BE VERIFIED
        // =====================================

        if (!Boolean.TRUE.equals(
                user.getEnabled()
        )) {

            if (!user.isEmailVerified()) {

                throw new RuntimeException(
                        "Please verify your email before signing in"
                );
            }

            throw new RuntimeException(
                    "Account is disabled"
            );
        }


        // =====================================
        // PASSWORD CHECK
        // =====================================

        if (user.getPassword() == null ||
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                )) {

            throw new RuntimeException(
                    "Invalid email/mobile or password"
            );
        }


        // =====================================
        // GENERATE JWT
        // =====================================

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );


        return new LoginResponse(
                token
        );
    }


    // =========================================
    // FORGOT PASSWORD
    //
    // SEND PASSWORD RESET OTP TO EMAIL
    // =========================================

    @Transactional
    public void forgotPassword(
            ForgotPasswordRequest request) {

        // =====================================
        // VALIDATE EMAIL
        // =====================================

        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }


        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // =====================================
        // FIND USER
        // =====================================

        User user =
                userRepository
                        .findByEmailIgnoreCase(
                                email
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "No account found with this email"
                                        )
                        );


        // =====================================
        // ACCOUNT CHECK
        // =====================================

        if (!Boolean.TRUE.equals(
                user.getEnabled()
        )) {

            throw new RuntimeException(
                    "Account is not active"
            );
        }


        // =====================================
        // GOOGLE-ONLY ACCOUNT CHECK
        //
        // If there is no local password,
        // password reset is unnecessary.
        // =====================================

        if (user.getPassword() == null ||
                user.getPassword().isBlank()) {

            throw new RuntimeException(
                    "This account uses Google Sign-In. Please continue with Google."
            );
        }


        // =====================================
        // INVALIDATE PREVIOUS ACTIVE RESET OTP
        // =====================================

        loginOtpRepository
                .findTopByIdentifierAndTypeAndUsedFalseOrderByCreatedAtDesc(
                        email,
                        "PASSWORD_RESET"
                )
                .ifPresent(
                        previousOtp -> {

                            previousOtp.setUsed(true);

                            loginOtpRepository.save(
                                    previousOtp
                            );
                        }
                );


        // =====================================
        // GENERATE OTP
        // =====================================

        String otp =
                generateOtp();


        // =====================================
        // CREATE PASSWORD RESET OTP
        // =====================================

        LoginOtp loginOtp =
                new LoginOtp();

        loginOtp.setIdentifier(
                email
        );

        loginOtp.setOtp(
                otp
        );

        loginOtp.setType(
                "PASSWORD_RESET"
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


        loginOtpRepository.save(
                loginOtp
        );


        // =====================================
        // SEND OTP
        // =====================================

        emailService.sendPasswordResetOtp(
                email,
                otp
        );
    }


    // =========================================
    // RESET PASSWORD
    //
    // EMAIL + OTP + NEW PASSWORD
    // =========================================

    @Transactional
    public void resetPassword(
            ResetPasswordRequest request) {

        // =====================================
        // EMAIL VALIDATION
        // =====================================

        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }


        // =====================================
        // OTP VALIDATION
        // =====================================

        if (request.getOtp() == null ||
                request.getOtp().isBlank()) {

            throw new RuntimeException(
                    "OTP is required"
            );
        }


        // =====================================
        // NEW PASSWORD VALIDATION
        // =====================================

        if (request.getNewPassword() == null ||
                request.getNewPassword().isBlank()) {

            throw new RuntimeException(
                    "New password is required"
            );
        }


        // =====================================
        // CONFIRM PASSWORD VALIDATION
        // =====================================

        if (request.getConfirmPassword() == null ||
                request.getConfirmPassword().isBlank()) {

            throw new RuntimeException(
                    "Confirm password is required"
            );
        }


        if (!request
                .getNewPassword()
                .equals(
                        request.getConfirmPassword()
                )) {

            throw new RuntimeException(
                    "Passwords do not match"
            );
        }


        // =====================================
        // BASIC PASSWORD LENGTH
        // =====================================

        if (request
                .getNewPassword()
                .length() < 8) {

            throw new RuntimeException(
                    "Password must be at least 8 characters"
            );
        }


        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // =====================================
        // FIND USER
        // =====================================

        User user =
                userRepository
                        .findByEmailIgnoreCase(
                                email
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Unable to reset password"
                                        )
                        );


        if (!Boolean.TRUE.equals(
                user.getEnabled()
        )) {

            throw new RuntimeException(
                    "Unable to reset password"
            );
        }


        // =====================================
        // FIND LATEST UNUSED RESET OTP
        // =====================================

        LoginOtp loginOtp =
                loginOtpRepository
                        .findTopByIdentifierAndTypeAndUsedFalseOrderByCreatedAtDesc(
                                email,
                                "PASSWORD_RESET"
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "OTP not found or already used"
                                        )
                        );


        // =====================================
        // CHECK EXPIRY
        // =====================================

        if (loginOtp
                .getExpiresAt()
                .isBefore(
                        LocalDateTime.now()
                )) {

            loginOtp.setUsed(true);

            loginOtpRepository.save(
                    loginOtp
            );

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }


        // =====================================
        // CHECK ATTEMPTS
        // =====================================

        if (loginOtp.getAttempts() >= 5) {

            loginOtp.setUsed(true);

            loginOtpRepository.save(
                    loginOtp
            );

            throw new RuntimeException(
                    "Too many incorrect OTP attempts. Please request a new OTP."
            );
        }


        // =====================================
        // VERIFY OTP
        // =====================================

        if (!loginOtp
                .getOtp()
                .equals(
                        request
                                .getOtp()
                                .trim()
                )) {

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
        // OPTIONAL SAFETY:
        // DON'T ALLOW SAME PASSWORD
        // =====================================

        if (user.getPassword() != null &&
                passwordEncoder.matches(
                        request.getNewPassword(),
                        user.getPassword()
                )) {

            throw new RuntimeException(
                    "New password must be different from your current password"
            );
        }


        // =====================================
        // UPDATE PASSWORD USING BCRYPT
        // =====================================

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );


        userRepository.save(
                user
        );


        // =====================================
        // OTP CAN NEVER BE USED AGAIN
        // =====================================

        loginOtp.setUsed(true);

        loginOtpRepository.save(
                loginOtp
        );
    }


    // =========================================
    // GENERATE 6 DIGIT OTP
    // =========================================

    private String generateOtp() {

        int number =
                100000 +
                        secureRandom.nextInt(
                                900000
                        );

        return String.valueOf(
                number
        );
    }


    // =========================================
    // MOBILE NORMALIZATION
    // =========================================

    private String normalizeMobile(
            String mobile) {

        if (mobile == null ||
                mobile.isBlank()) {

            return null;
        }


        String value =
                mobile.trim()
                        .replace(" ", "")
                        .replace("-", "");


        // +919876543210

        if (value.startsWith("+91")) {

            value =
                    value.substring(3);

        } else if (
                value.startsWith("91") &&
                        value.length() == 12
        ) {

            // 919876543210

            value =
                    value.substring(2);
        }


        if (!value.matches(
                "[6-9][0-9]{9}"
        )) {

            throw new RuntimeException(
                    "Invalid mobile number"
            );
        }


        return value;
    }
}