package com.currencyconveterworld.currencyconveterworld.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {


        // ==========================================
        // Get Authorization Header
        // ==========================================

        String authHeader =
                request.getHeader("Authorization");


        // ==========================================
        // Debug Header
        // Do NOT print the actual JWT token
        // ==========================================

        if (authHeader == null) {

            System.out.println(
                    "Authorization Header: null"
            );

        } else {

            System.out.println(
                    "Authorization Header: Bearer token received"
            );
        }


        // ==========================================
        // Check Bearer Token
        // ==========================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println(
                    "JWT: Bearer token missing"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // ==========================================
        // Extract JWT
        // ==========================================

        String token =
                authHeader.substring(7);


        try {

            // ==========================================
            // Validate JWT
            // ==========================================

            if (jwtService.isTokenValid(token)) {


                // ==========================================
                // Extract Email
                // ==========================================

                String email =
                        jwtService.extractEmail(token);


                // ==========================================
                // Create Authentication Object
                // ==========================================

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.emptyList()
                        );


                // ==========================================
                // Store Authentication in Security Context
                // ==========================================

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);


                System.out.println(
                        "JWT Authentication Successful: "
                                + email
                );

            } else {

                System.out.println(
                        "JWT Authentication Failed: Token is invalid or expired"
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT Authentication Failed: "
                            + e.getMessage()
            );
        }


        // ==========================================
        // Continue Request
        // ==========================================

        filterChain.doFilter(
                request,
                response
        );
    }
}