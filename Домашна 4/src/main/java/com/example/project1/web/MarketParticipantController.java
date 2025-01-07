package com.example.project1.web;


import com.example.project1.entity.MarketParticipant;
import com.example.project1.service.MarketParticipantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/company")
@CrossOrigin(origins = "*")
public class MarketParticipantController {
    private final MarketParticipantService marketParticipantService;

    public MarketParticipantController(MarketParticipantService marketParticipantService) {
        this.marketParticipantService = marketParticipantService;
    }

    @GetMapping("")
    public ResponseEntity<String> getCompanyBasePath() {
        return new ResponseEntity<>("Company endpoint is available", HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllCompanies() {
        try {
            List<MarketParticipant> companies = marketParticipantService.getAllCompanies();
            System.out.println("Found " + companies.size() + " companies");
            return ResponseEntity.ok(companies);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching companies: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarketParticipant> getCompanyById(@PathVariable(value = "id") Long id) {
        Optional<MarketParticipant> company = marketParticipantService.getCompanyById(id);
        return company.map(c -> new ResponseEntity<>(c, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/create")
    public ResponseEntity<MarketParticipant> createCompany(@RequestBody MarketParticipant company) {
        MarketParticipant createdCompany = marketParticipantService.saveCompany(company);
        return new ResponseEntity<>(createdCompany, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarketParticipant> updateCompany(@PathVariable(value = "id") Long id, @RequestBody MarketParticipant companyDetails) {
        Optional<MarketParticipant> companyOptional = marketParticipantService.getCompanyById(id);
        if (companyOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        MarketParticipant company = companyOptional.get();
        company.setCompanyCode(companyDetails.getCompanyCode());

        marketParticipantService.saveCompany(company);
        return new ResponseEntity<>(company, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable(value = "id") Long id) {
        Optional<MarketParticipant> company = marketParticipantService.getCompanyById(id);
        if (company.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        marketParticipantService.deleteCompany(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
