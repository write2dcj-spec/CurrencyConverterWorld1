package com.currencyconveterworld.currencyconveterworld.Services;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class EmailService {

    private static final String BREVO_API_URL =
            "https://api.brevo.com/v3/smtp/email";

    private final RestClient.Builder restClientBuilder;


    @Value("${brevo.api.key}")
    private String brevoApiKey;


    @Value("${brevo.sender.email}")
    private String senderEmail;


    @Value("${brevo.sender.name:Currency Converter World}")
    private String senderName;


    // ==========================================
    // LOGIN OTP
    // ==========================================

    public void sendLoginOtp(
            String email,
            String otp) {

        String subject =
                "Currency Converter World - Login OTP";

        String content =
                "Your login OTP is: " + otp +
                        "\n\nThis OTP is valid for 5 minutes." +
                        "\nDo not share this OTP with anyone." +
                        "\n\nIf you did not request this login, " +
                        "you can ignore this email.";

        sendEmail(
                email,
                subject,
                content
        );
    }


    // ==========================================
    // REGISTRATION EMAIL VERIFICATION OTP
    // ==========================================

    public void sendRegistrationOtp(
            String email,
            String otp) {

        String subject =
                "Currency Converter World - Verify Your Email";

        String content =
                "Welcome to Currency Converter World!" +
                        "\n\nYour email verification OTP is: " + otp +
                        "\n\nThis OTP is valid for 5 minutes." +
                        "\nDo not share this OTP with anyone." +
                        "\n\nEnter this OTP to verify your email " +
                        "and complete your registration.";

        sendEmail(
                email,
                subject,
                content
        );
    }


    // ==========================================
    // PASSWORD RESET OTP
    // ==========================================

    public void sendPasswordResetOtp(
            String email,
            String otp) {

        String subject =
                "Currency Converter World - Password Reset OTP";

        String content =
                "We received a request to reset your password." +
                        "\n\nYour password reset OTP is: " + otp +
                        "\n\nThis OTP is valid for 5 minutes." +
                        "\nDo not share this OTP with anyone." +
                        "\n\nIf you did not request a password reset, " +
                        "you can ignore this email.";

        sendEmail(
                email,
                subject,
                content
        );
    }


    // ==========================================
    // BREVO HTTPS API
    // ==========================================

    private void sendEmail(
            String recipientEmail,
            String subject,
            String content) {

        try {

            RestClient restClient =
                    restClientBuilder.build();


            Map<String, Object> requestBody =
                    Map.of(
                            "sender",
                            Map.of(
                                    "name", senderName,
                                    "email", senderEmail
                            ),

                            "to",
                            List.of(
                                    Map.of(
                                            "email",
                                            recipientEmail
                                    )
                            ),

                            "subject",
                            subject,

                            "textContent",
                            content
                    );


            restClient
                    .post()
                    .uri(BREVO_API_URL)
                    .header(
                            "api-key",
                            brevoApiKey
                    )
                    .contentType(
                            MediaType.APPLICATION_JSON
                    )
                    .body(requestBody)
                    .retrieve()
                    .toBodilessEntity();


            System.out.println(
                    "Email sent successfully through Brevo API to: "
                            + recipientEmail
            );


        } catch (Exception e) {

            System.err.println(
                    "Brevo email sending failed: "
                            + e.getMessage()
            );

            throw new RuntimeException(
                    "Unable to send email. Please try again later."
            );
        }
    }
}
