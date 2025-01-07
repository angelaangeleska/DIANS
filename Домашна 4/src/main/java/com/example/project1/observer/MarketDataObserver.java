package com.example.project1.observer;

import com.example.project1.entity.MarketData;

public interface MarketDataObserver {
    void update(MarketData marketData);
}