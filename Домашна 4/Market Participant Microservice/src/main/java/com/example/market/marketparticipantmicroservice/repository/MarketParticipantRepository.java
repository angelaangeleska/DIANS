package com.example.market.marketparticipantmicroservice.repository;

import com.example.market.marketparticipantmicroservice.entity.MarketParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MarketParticipantRepository extends JpaRepository<MarketParticipant, Long> {
    Optional<MarketParticipant> findByCompanyCode(String companyCode);
}