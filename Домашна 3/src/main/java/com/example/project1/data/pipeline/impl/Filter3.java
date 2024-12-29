package com.example.project1.data.pipeline.impl;

import com.example.project1.data.FinancialDataParser;
import com.example.project1.data.pipeline.Filter;
import com.example.project1.entity.MarketParticipant;
import com.example.project1.entity.MarketData;
import com.example.project1.repository.MarketParticipantRepository;
import com.example.project1.repository.MarketDataRepository;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.text.NumberFormat;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

public class Filter3 implements Filter<List<MarketParticipant>> {

    private final MarketParticipantRepository marketParticipantRepository;
    private final MarketDataRepository marketDataRepository;

    private static final String HISTORICAL_DATA_URL = "https://www.mse.mk/mk/stats/symbolhistory/";

    public Filter3(MarketParticipantRepository marketParticipantRepository, MarketDataRepository marketDataRepository) {
        this.marketParticipantRepository = marketParticipantRepository;
        this.marketDataRepository = marketDataRepository;
    }

    public List<MarketParticipant> execute(List<MarketParticipant> input) throws IOException, ParseException {

        for (MarketParticipant company : input) {
            LocalDate fromDate = LocalDate.now();
            LocalDate toDate = LocalDate.now().plusYears(1);
            getData(company, fromDate, toDate);
        }

        return null;
    }

    private void getData(MarketParticipant company, LocalDate fromDate, LocalDate toDate) throws IOException {
        Connection.Response response = Jsoup.connect(HISTORICAL_DATA_URL + company.getCompanyCode())
                .data("FromDate", fromDate.toString())
                .data("ToDate", toDate.toString())
                .method(Connection.Method.POST)
                .execute();

        Document document = response.parse();

        Element table = document.select("table#resultsTable").first();

        if (table != null) {
            Elements rows = table.select("tbody tr");

            for (Element row : rows) {
                Elements columns = row.select("td");

                if (columns.size() > 0) {
                    LocalDate date = FinancialDataParser.parseDate(columns.get(0).text(), "d.M.yyyy");

                    if (marketDataRepository.findByDateAndCompany(date, company).isEmpty()) {


                        NumberFormat format = NumberFormat.getInstance(Locale.GERMANY);

                        Double lastTransactionPrice = FinancialDataParser.parseDouble(columns.get(1).text(), format);
                        Double maxPrice = FinancialDataParser.parseDouble(columns.get(2).text(), format);
                        Double minPrice = FinancialDataParser.parseDouble(columns.get(3).text(), format);
                        Double averagePrice = FinancialDataParser.parseDouble(columns.get(4).text(), format);
                        Double percentageChange = FinancialDataParser.parseDouble(columns.get(5).text(), format);
                        Integer quantity = FinancialDataParser.parseInteger(columns.get(6).text(), format);
                        Integer turnoverBest = FinancialDataParser.parseInteger(columns.get(7).text(), format);
                        Integer totalTurnover = FinancialDataParser.parseInteger(columns.get(8).text(), format);

                        if (maxPrice != null) {

                            if (company.getLastUpdated() == null || company.getLastUpdated().isBefore(date)) {
                                company.setLastUpdated(date);
                            }

                            MarketData marketData = new MarketData(
                                    date, lastTransactionPrice, maxPrice, minPrice, averagePrice, percentageChange,
                                    quantity, turnoverBest, totalTurnover);
                            marketData.setCompany(company);
                            marketDataRepository.save(marketData);
                            company.getHistoricalData().add(marketData);
                        }
                    }
                }
            }
        }

        marketParticipantRepository.save(company);
    }


}
