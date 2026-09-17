package com.currencyconveterworld.currencyconveterworld.Security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "mySecretKeyForCurrencyConverterApplication123456789123456789";


    private final SecretKey key =
            Keys.hmacShaKeyFor(
                    SECRET_KEY.getBytes(StandardCharsets.UTF_8)
            );


    // =====================================================
    // Generate JWT
    // =====================================================

    public String generateToken(String email) {

        Date now = new Date();

        Date expiration =
                new Date(
                        System.currentTimeMillis()
                                + 1000L * 60 * 60 * 24
                );


        String token =
                Jwts.builder()
                        .subject(email)
                        .issuedAt(now)
                        .expiration(expiration)
                        .signWith(key)
                        .compact();


        System.out.println(
                "JWT generated successfully for: " + email
        );

        System.out.println(
                "JWT expires at: " + expiration
        );


        return token;
    }


    // =====================================================
    // Extract Email
    // =====================================================

    public String extractEmail(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }


    // =====================================================
    // Validate JWT
    // =====================================================

    public boolean isTokenValid(String token) {

        try {

            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);

            System.out.println(
                    "JWT validation: VALID"
            );

            return true;

        } catch (ExpiredJwtException e) {

            System.out.println(
                    "JWT validation failed: TOKEN EXPIRED"
            );

            System.out.println(
                    "Token expired at: "
                            + e.getClaims().getExpiration()
            );

            return false;

        } catch (JwtException e) {

            System.out.println(
                    "JWT validation failed: "
                            + e.getMessage()
            );

            return false;

        } catch (Exception e) {

            System.out.println(
                    "JWT validation unexpected error: "
                            + e.getMessage()
            );

            return false;
        }
    }
}