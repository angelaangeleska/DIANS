package com.example.project1.web;

import com.example.project1.entity.MarketData;
import com.example.project1.service.MarketDataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*")
public class MarketDataController {
    private final MarketDataService marketDataService;

    public MarketDataController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    @GetMapping("")
    public ResponseEntity<String> getDataBasePath() {
        return new ResponseEntity<>("Data endpoint is available", HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<MarketData>> getAllData() {
        List<MarketData> data = marketDataService.getAllData();
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarketData> getDataById(@PathVariable(value = "id") Long id) {
        Optional<MarketData> data = marketDataService.getDataById(id);
        return data.map(d -> new ResponseEntity<>(d, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/create")
    public ResponseEntity<MarketData> createData(@RequestBody MarketData data) {
        MarketData createdData = marketDataService.saveData(data);
        return new ResponseEntity<>(createdData, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarketData> updateData(@PathVariable(value = "id") Long id, @RequestBody MarketData dataDetails) {
        Optional<MarketData> dataOptional = marketDataService.getDataById(id);
        if (dataOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        MarketData data = dataOptional.get();
        data.setDate(dataDetails.getDate());
        data.setLastTransactionPrice(dataDetails.getLastTransactionPrice());
        data.setMaxPrice(dataDetails.getMaxPrice());
        data.setMinPrice(dataDetails.getMinPrice());
        data.setAveragePrice(dataDetails.getAveragePrice());
        data.setPercentageChange(dataDetails.getPercentageChange());
        data.setQuantity(dataDetails.getQuantity());
        data.setTurnoverBest(dataDetails.getTurnoverBest());
        data.setTotalTurnover(dataDetails.getTotalTurnover());

        marketDataService.saveData(data);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteData(@PathVariable(value = "id") Long id) {
        Optional<MarketData> data = marketDataService.getDataById(id);
        if (data.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        marketDataService.deleteData(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
