package com.example.project1.data.pipeline.impl;

import com.example.project1.data.pipeline.Filter;
import com.example.project1.entity.MarketParticipant;
import com.example.project1.repository.MarketParticipantRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.List;

public class Filter1 implements Filter<List<MarketParticipant>> {

    private final MarketParticipantRepository marketParticipantRepository;

    public Filter1(MarketParticipantRepository marketParticipantRepository) {
        this.marketParticipantRepository = marketParticipantRepository;
    }

    private static final String STOCK_MARKET_URL = "https://www.mse.mk/mk/stats/symbolhistory/kmb";

    @Override
    public List<MarketParticipant> execute(List<MarketParticipant> input) throws IOException {
        Document document = Jsoup.connect(STOCK_MARKET_URL).get();
        Element selectMenu = document.select("select#Code").first();

        if (selectMenu != null) {
            Elements options = selectMenu.select("option");
            for (Element option : options) {
                String code = option.attr("value");
                if (!code.isEmpty() && code.matches("^[a-zA-Z]+$")) {
                    if (marketParticipantRepository.findByCompanyCode(code).isEmpty()) {
                        marketParticipantRepository.save(new MarketParticipant(code));
                    }
                }
            }
        }
        return marketParticipantRepository.findAll();
    }
}
