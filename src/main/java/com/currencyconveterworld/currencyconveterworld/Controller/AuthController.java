package com.currencyconveterworld.currencyconveterworld.Controller;

import com.currencyconveterworld.currencyconveterworld.Dto.ForgotPasswordRequest;
import com.currencyconveterworld.currencyconveterworld.Dto.LoginRequest;
import com.currencyconveterworld.currencyconveterworld.Dto.RegisterRequest;
import com.currencyconveterworld.currencyconveterworld.Dto.ResetPasswordRequest;
import com.currencyconveterworld.currencyconveterworld.Dto.SendOtpRequest;
import com.currencyconveterworld.currencyconveterworld.Dto.VerifyOtpRequest;

import com.currencyconveterworld.currencyconveterworld.Services.AuthService;
import com.currencyconveterworld.currencyconveterworld.Services.LoginOtpService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://currency-converter-world1.vercel.app"
})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final LoginOtpService loginOtpService;


    // =========================================
    // REGISTER
    // =========================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {

            authService.register(request);

            return ResponseEntity.ok(
                    "Verification OTP sent to your email"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================
    // VERIFY REGISTRATION EMAIL OTP
    // =========================================

    @PostMapping("/verify-register-otp")
    public ResponseEntity<?> verifyRegisterOtp(
            @RequestBody VerifyOtpRequest request) {

        try {

            authService.verifyRegisterOtp(
                    request.getIdentifier(),
                    request.getOtp()
            );


            return ResponseEntity.ok(
                    "Email verified successfully. Account created successfully."
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================
    // PASSWORD LOGIN
    // EMAIL OR MOBILE
    // =========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            return ResponseEntity.ok(
                    authService.login(
                            request
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================
    // SEND LOGIN OTP
    // EMAIL OR MOBILE
    // =========================================

    @PostMapping("/send-login-otp")
    public ResponseEntity<?> sendLoginOtp(
            @RequestBody SendOtpRequest request) {

        try {

            loginOtpService.sendOtp(
                    request.getIdentifier()
            );


            return ResponseEntity.ok(
                    "OTP sent successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================
    // VERIFY LOGIN OTP
    // EMAIL OR MOBILE
    // =========================================

    @PostMapping("/verify-login-otp")
    public ResponseEntity<?> verifyLoginOtp(
            @RequestBody VerifyOtpRequest request) {

        try {

            return ResponseEntity.ok(

                    loginOtpService.verifyOtp(
                            request.getIdentifier(),
                            request.getOtp()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================
    // FORGOT PASSWORD
    //
    // Sends PASSWORD_RESET OTP to user's email
    // =========================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        try {

            authService.forgotPassword(
                    request
            );


            return ResponseEntity.ok(
                    "Password reset OTP sent successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================
    // RESET PASSWORD
    //
    // Verifies PASSWORD_RESET OTP
    // and updates password
    // =========================================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        try {

            authService.resetPassword(
                    request
            );


            return ResponseEntity.ok(
                    "Password reset successfully. Please sign in with your new password."
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================
    // AUTH TEST
    // =========================================

    @GetMapping("/me")
    public ResponseEntity<?> me() {

        return ResponseEntity.ok(
                "User authenticated successfully"
        );
    }
}
