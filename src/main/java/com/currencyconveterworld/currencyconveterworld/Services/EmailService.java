package com.currencyconveterworld.currencyconveterworld.Services;

import lombok.RequiredArgsConstructor;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;


    // ==========================================
    // LOGIN OTP
    // ==========================================

    public void sendLoginOtp(
            String email,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "Currency Converter World - Login OTP"
        );

        message.setText(
                "Your login OTP is: " + otp +
                        "\n\nThis OTP is valid for 5 minutes." +
                        "\nDo not share this OTP with anyone." +
                        "\n\nIf you did not request this login, " +
                        "you can ignore this email."
        );

        mailSender.send(message);
    }


    // ==========================================
    // REGISTRATION EMAIL VERIFICATION OTP
    // ==========================================

    public void sendRegistrationOtp(
            String email,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "Currency Converter World - Verify Your Email"
        );

        message.setText(
                "Welcome to Currency Converter World!" +
                        "\n\nYour email verification OTP is: " + otp +
                        "\n\nThis OTP is valid for 5 minutes." +
                        "\nDo not share this OTP with anyone." +
                        "\n\nEnter this OTP to verify your email " +
                        "and complete your registration."
        );

        mailSender.send(message);
    }


    // ==========================================
    // PASSWORD RESET OTP
    // ==========================================

    public void sendPasswordResetOtp(
            String email,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "Currency Converter World - Password Reset OTP"
        );

        message.setText(
                "We received a request to reset your password." +
                        "\n\nYour password reset OTP is: " + otp +
                        "\n\nThis OTP is valid for 5 minutes." +
                        "\nDo not share this OTP with anyone." +
                        "\n\nIf you did not request a password reset, " +
                        "you can ignore this email."
        );

        mailSender.send(message);
    }
}