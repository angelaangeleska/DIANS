package com.example.project1.observer;

import com.example.project1.entity.MarketData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class MarketDataLogger implements MarketDataObserver {
    private static final Logger logger = LoggerFactory.getLogger(MarketDataLogger.class);

    @Override
    public void update(MarketData marketData) {
        logger.info("Market data updated for company {}: Price = {}, Change = {}%",
                marketData.getCompany().getCompanyCode(),
                marketData.getLastTransactionPrice(),
                marketData.getPercentageChange());
    }
}