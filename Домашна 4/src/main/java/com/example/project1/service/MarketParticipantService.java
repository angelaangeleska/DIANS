package com.example.project1.service;

import com.example.project1.entity.MarketParticipant;

import java.util.List;
import java.util.Optional;

public interface MarketParticipantService {
    List<MarketParticipant> getAllCompanies();
    Optional<MarketParticipant> getCompanyById(Long id);
    MarketParticipant saveCompany(MarketParticipant company);
    void deleteCompany(Long id);
}
