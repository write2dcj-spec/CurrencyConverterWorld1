package com.currencyconveterworld.currencyconveterworld.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String provider;
}