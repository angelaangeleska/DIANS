package com.example.project1.repository;

import com.example.project1.entity.MarketData;
import com.example.project1.entity.MarketParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface MarketParticipantRepository extends JpaRepository<MarketParticipant, Long> {
    Optional<MarketParticipant> findByCompanyCode(String companyCode);
}
