package com.currencyconveterworld.currencyconveterworld.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true)
    private String mobileNumber;

    // BCrypt encoded password for LOCAL users.
    // Google users can have NULL password.
    private String password;

    // USER / ADMIN
    private String role;

    // LOCAL / GOOGLE
    @Column(nullable = false)
    private String provider;

    // Google's unique ID.
    // NULL for LOCAL users.
    private String providerId;

    @Column(nullable = false)
    private Boolean enabled = true;

    private LocalDateTime createdAt;

    private boolean emailVerified;

    private boolean mobileVerified;
}