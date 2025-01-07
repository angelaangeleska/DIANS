package com.example.project1.service;

import com.example.project1.entity.MarketData;

import java.util.List;
import java.util.Optional;

public interface MarketDataService {
    List<MarketData> getAllData();
    Optional<MarketData> getDataById(Long id);
    MarketData saveData(MarketData data);
    void deleteData(Long id);
}
