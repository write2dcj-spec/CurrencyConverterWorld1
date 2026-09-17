//package com.currencyconveterworld.currencyconveterworld.Services;
//
//import com.currencyconveterworld.currencyconveterworld.Entities.EmailVerification;
//import com.currencyconveterworld.currencyconveterworld.Repositories.EmailVerificationRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.Optional;
//
//@Service
//public class EmailVerificationService {
//
//    @Autowired
//    private EmailVerificationRepository emailVerificationRepository;
//
//    @Autowired
//    private EmailService emailService;
//
//    @Autowired
//    private OtpService otpService;
//
//    public void sendVerificationOtp(String email) {
//
//        String otp = otpService.generateOtp();
//
//        Optional<EmailVerification> existingVerification =
//                emailVerificationRepository.findByEmail(email);
//
//        EmailVerification verification;
//
//        if (existingVerification.isPresent()) {
//            verification = existingVerification.get();
//        } else {
//            verification = new EmailVerification();
//            verification.setEmail(email);
//        }
//
//        verification.setOtp(otp);
//        verification.setExpiryTime(
//                LocalDateTime.now().plusMinutes(10)
//        );
//        verification.setVerified(false);
//
//        emailVerificationRepository.save(verification);
//
//        emailService.sendOtpEmail(email, otp);
//    }
//
//    public boolean verifyOtp(String email, String otp) {
//
//        Optional<EmailVerification> optionalVerification =
//                emailVerificationRepository.findByEmail(email);
//
//        if (optionalVerification.isEmpty()) {
//            return false;
//        }
//
//        EmailVerification verification =
//                optionalVerification.get();
//
//        if (!verification.getOtp().equals(otp)) {
//            return false;
//        }
//
//        if (verification.getExpiryTime()
//                .isBefore(LocalDateTime.now())) {
//            return false;
//        }
//
//        verification.setVerified(true);
//
//        emailVerificationRepository.save(verification);
//
//        return true;
//    }
//}