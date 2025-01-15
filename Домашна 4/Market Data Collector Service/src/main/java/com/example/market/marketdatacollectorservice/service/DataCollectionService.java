package com.example.market.marketdatacollectorservice.service;

import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class DataCollectionService {
    private static final String STOCK_MARKET_URL = "https://www.mse.mk/mk/stats/symbolhistory/kmb";
    private final RestTemplate restTemplate;

    @Scheduled(cron = "0 0 * * * *") // Run every hour
    public void collectMarketData() {
        try {
            Document document = Jsoup.connect(STOCK_MARKET_URL).get();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}