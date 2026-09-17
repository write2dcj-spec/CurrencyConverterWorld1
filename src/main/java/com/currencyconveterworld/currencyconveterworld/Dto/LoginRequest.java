package com.currencyconveterworld.currencyconveterworld.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    // Can contain either:
    // deepak@example.com
    // OR
    // 9876543210
    private String identifier;

    private String password;
}