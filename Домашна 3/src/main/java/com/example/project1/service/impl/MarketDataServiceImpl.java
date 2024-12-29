package com.example.project1.service.impl;

import com.example.project1.entity.MarketData;
import com.example.project1.repository.MarketDataRepository;
import com.example.project1.service.MarketDataService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarketDataServiceImpl implements MarketDataService {
    private final MarketDataRepository marketDataRepository;

    public MarketDataServiceImpl(MarketDataRepository marketDataRepository) {
        this.marketDataRepository = marketDataRepository;
    }

    @Override
    public List<MarketData> getAllData() {
        return marketDataRepository.findAll();
    }

    @Override
    public Optional<MarketData> getDataById(Long id) {
        return marketDataRepository.findById(id);
    }

    @Override
    public MarketData saveData(MarketData data) {
        return marketDataRepository.save(data);
    }

    @Override
    public void deleteData(Long id) {
        marketDataRepository.deleteById(id);
    }
}
