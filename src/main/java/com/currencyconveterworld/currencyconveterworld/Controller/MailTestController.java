package com.currencyconveterworld.currencyconveterworld.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MailTestController {

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/mail-test")
    public String sendMail() {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo("deepakjoshicse@gmail.com");
        message.setSubject("Spring Boot Test");
        message.setText("Hello Deepak!");

        mailSender.send(message);

        return "Mail Sent";
    }
}