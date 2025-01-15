package com.example.market.marketparticipantmicroservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MarketParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyCode;
    private LocalDate lastUpdated;

    public MarketParticipant(String companyCode) {
        this.companyCode = companyCode;
    }
}