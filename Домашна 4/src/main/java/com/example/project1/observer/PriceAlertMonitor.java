package com.example.project1.observer;

import com.example.project1.entity.MarketData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PriceAlertMonitor implements MarketDataObserver {
    private static final Logger logger = LoggerFactory.getLogger(PriceAlertMonitor.class);

    @Override
    public void update(MarketData marketData) {
        if (marketData.getPercentageChange() != null && Math.abs(marketData.getPercentageChange()) > 5.0) {
            logger.warn("Significant price movement for {}: {}%",
                    marketData.getCompany().getCompanyCode(),
                    marketData.getPercentageChange());
        }
    }
}
