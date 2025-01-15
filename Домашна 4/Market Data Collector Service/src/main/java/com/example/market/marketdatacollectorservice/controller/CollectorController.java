package com.example.market.marketdatacollectorservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/collector")
@RequiredArgsConstructor
public class CollectorController {

    private final com.example.market.marketdatacollectorservice.service.DataCollectionService dataCollectionService;

    @PostMapping("/collect")
    public ResponseEntity<String> triggerCollection() {
        dataCollectionService.collectMarketData();
        return ResponseEntity.ok("Data collection started");
    }
}