package com.example.market.marketparticipantmicroservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MarketParticipantMicroserviceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarketParticipantMicroserviceApplication.class, args);
    }

}
