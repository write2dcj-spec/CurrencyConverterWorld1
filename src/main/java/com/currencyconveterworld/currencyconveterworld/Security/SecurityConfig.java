package com.currencyconveterworld.currencyconveterworld.Security;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {


    private final OAuth2LoginSuccessHandler
            oAuth2LoginSuccessHandler;


    private final JwtAuthenticationFilter
            jwtAuthenticationFilter;


    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {


        http


                // =========================================
                // CORS
                // =========================================

                .cors(
                        Customizer.withDefaults()
                )


                // =========================================
                // CSRF
                // =========================================

                .csrf(
                        csrf -> csrf.disable()
                )


                // =========================================
                // AUTHORIZATION
                // =========================================

                .authorizeHttpRequests(
                        auth -> auth


                                // =================================
                                // CORS PREFLIGHT
                                // =================================

                                .requestMatchers(
                                        HttpMethod.OPTIONS,
                                        "/**"
                                )
                                .permitAll()


                                // =================================
                                // PUBLIC AUTHENTICATION APIs
                                // =================================

                                .requestMatchers(
                                        "/api/auth/**"
                                )
                                .permitAll()


                                // =================================
                                // PUBLIC CURRENCY LIST
                                //
                                // Required by the converter so both
                                // guest and logged-in users can load
                                // supported currencies.
                                //
                                // GET /api/currencies
                                // =================================

                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/currencies"
                                )
                                .permitAll()


                                // =================================
                                // PUBLIC CURRENCY CONVERSION
                                //
                                // Guest users can convert currencies.
                                //
                                // ONLY:
                                // POST /api/conversions
                                //
                                // GET /api/conversions/history
                                // remains protected.
                                // =================================

                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/conversions"
                                )
                                .permitAll()


                                // =================================
                                // GOOGLE OAUTH
                                // =================================

                                .requestMatchers(
                                        "/oauth2/**",
                                        "/login/oauth2/**"
                                )
                                .permitAll()


                                // =================================
                                // EVERYTHING ELSE PROTECTED
                                // =================================

                                .anyRequest()
                                .authenticated()
                )


                // =========================================
                // UNAUTHORIZED API RESPONSE
                // =========================================

                .exceptionHandling(
                        exception -> exception

                                .authenticationEntryPoint(
                                        new HttpStatusEntryPoint(
                                                HttpStatus.UNAUTHORIZED
                                        )
                                )
                )


                // =========================================
                // GOOGLE OAUTH2 LOGIN
                // =========================================

                .oauth2Login(
                        oauth2 -> oauth2

                                .successHandler(
                                        oAuth2LoginSuccessHandler
                                )
                )


                // =========================================
                // JWT FILTER
                // =========================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =====================================================
    // CORS CONFIGURATION
    // =====================================================

    @Bean
    public CorsConfigurationSource
    corsConfigurationSource() {


        CorsConfiguration configuration =
                new CorsConfiguration();


        // =========================================
        // FRONTEND ORIGIN
        // =========================================

       configuration.setAllowedOrigins(
        List.of(
                "http://localhost:5173",
                "https://currency-converter-world1.vercel.app"
        )
);


        // =========================================
        // ALLOWED METHODS
        // =========================================

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );


        // =========================================
        // ALLOWED HEADERS
        // =========================================

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );


        // =========================================
        // ALLOW CREDENTIALS
        // =========================================

        configuration.setAllowCredentials(
                true
        );


        // =========================================
        // REGISTER CORS
        // =========================================

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }
}
