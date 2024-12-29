package com.example.project1.repository;

import com.example.project1.entity.MarketParticipant;
import com.example.project1.entity.MarketData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface MarketDataRepository extends JpaRepository<MarketData, Long> {
    Optional<MarketData> findByDateAndCompany(LocalDate date, MarketParticipant company);
}
