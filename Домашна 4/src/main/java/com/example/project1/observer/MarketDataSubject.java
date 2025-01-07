package com.example.project1.observer;

public interface MarketDataSubject {
    void registerObserver(MarketDataObserver observer);
    void removeObserver(MarketDataObserver observer);
    void notifyObservers();
}