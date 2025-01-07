package com.example.project1.service.impl;

import com.example.project1.entity.MarketParticipant;
import com.example.project1.repository.MarketParticipantRepository;
import com.example.project1.service.MarketParticipantService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarketParticipantServiceImpl implements MarketParticipantService {
    private final MarketParticipantRepository marketParticipantRepository;

    public MarketParticipantServiceImpl(MarketParticipantRepository marketParticipantRepository) {
        this.marketParticipantRepository = marketParticipantRepository;
    }

    @Override
    public List<MarketParticipant> getAllCompanies() {
        return marketParticipantRepository.findAll();
    }

    @Override
    public Optional<MarketParticipant> getCompanyById(Long id) {
        return marketParticipantRepository.findById(id);
    }

    @Override
    public MarketParticipant saveCompany(MarketParticipant company) {
        return marketParticipantRepository.save(company);
    }

    @Override
    public void deleteCompany(Long id) {
        marketParticipantRepository.deleteById(id);
    }
}
