package com.example.project1.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "market_participant")
@Data
@NoArgsConstructor
public class MarketParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_code")
    private String companyCode;

    @Column(name = "last_updated")
    private LocalDate lastUpdated;

    @OneToMany(mappedBy = "company", fetch = FetchType.EAGER)
    private List<MarketData> historicalData;

    public MarketParticipant(String companyCode) {
        this.companyCode = companyCode;
    }

}
