package com.example.project1.data;

import com.example.project1.data.pipeline.Pipe;
import com.example.project1.data.pipeline.impl.Filter1;
import com.example.project1.data.pipeline.impl.Filter2;
import com.example.project1.data.pipeline.impl.Filter3;
import com.example.project1.entity.MarketParticipant;
import com.example.project1.repository.MarketParticipantRepository;
import com.example.project1.repository.MarketDataRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializr {

    private final MarketParticipantRepository marketParticipantRepository;
    private final MarketDataRepository marketDataRepository;

    @PostConstruct
    private void initializeData() {
        if (marketParticipantRepository.count() > 0) {
            System.out.println("Database already populated, skipping initialization");
            return;
        }

        try {
            long startTime = System.nanoTime();
            Pipe<List<MarketParticipant>> pipe = new Pipe<>();
            pipe.addFilter(new Filter1(marketParticipantRepository));
            pipe.addFilter(new Filter2(marketParticipantRepository, marketDataRepository));
            pipe.addFilter(new Filter3(marketParticipantRepository, marketDataRepository));
            pipe.runFilter(null);
            long endTime = System.nanoTime();
            long durationInMillis = (endTime - startTime) / 1_000_000;

            System.out.printf("Total time for all filters to complete: %02d hours, %02d minutes, %02d seconds%n",
                    durationInMillis / 3_600_000,
                    (durationInMillis % 3_600_000) / 60_000,
                    (durationInMillis % 60_000) / 1_000);
        } catch (Exception e) {
            System.err.println("Error during data initialization: " + e.getMessage());
        }
    }
}
