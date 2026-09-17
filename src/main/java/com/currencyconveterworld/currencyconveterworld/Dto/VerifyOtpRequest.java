package com.currencyconveterworld.currencyconveterworld.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyOtpRequest {

    private String identifier;

    private String otp;
}