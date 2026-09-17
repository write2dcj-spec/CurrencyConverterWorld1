package com.currencyconveterworld.currencyconveterworld.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String name;

    private String email;

    private String mobileNumber;

    private String password;
}