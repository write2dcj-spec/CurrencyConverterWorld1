package com.currencyconveterworld.currencyconveterworld.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

    @Entity
@Table(name = "currencies")
    public class Currency {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String code;
        private String name;
        private String symbol;
        private String country;
        private String flagUrl;
        private boolean active;

        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;


    }
