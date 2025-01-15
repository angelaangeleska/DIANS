package com.example.market.marketparticipantmicroservice.service;

import com.example.market.marketparticipantmicroservice.entity.MarketParticipant;
import com.example.market.marketparticipantmicroservice.repository.MarketParticipantRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MarketParticipantService {
    private final MarketParticipantRepository repository;

    public MarketParticipantService(MarketParticipantRepository repository) {
        this.repository = repository;
    }

    public List<MarketParticipant> getAllParticipants() {
        return repository.findAll();
    }

    public Optional<MarketParticipant> getParticipantById(Long id) {
        return repository.findById(id);
    }

    public Optional<MarketParticipant> getParticipantByCode(String code) {
        return repository.findByCompanyCode(code);
    }

    public MarketParticipant saveParticipant(MarketParticipant participant) {
        return repository.save(participant);
    }

    public void deleteParticipant(Long id) {
        repository.deleteById(id);
    }
}
