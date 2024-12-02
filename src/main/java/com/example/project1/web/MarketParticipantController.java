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
@CrossOrigin(origins = "http://localhost:3000")
public class MarketParticipantController {
    private final MarketParticipantService marketParticipantService;

    public MarketParticipantController(MarketParticipantService marketParticipantService) {
        this.marketParticipantService = marketParticipantService;
    }

    // Base endpoint for /api/company
    @GetMapping("")
    public ResponseEntity<String> getCompanyBasePath() {
        return new ResponseEntity<>("Company endpoint is available", HttpStatus.OK);
    }

    // Endpoint to get all companies
    @GetMapping("/all")
    public ResponseEntity<List<MarketParticipant>> getAllCompanies() {
        List<MarketParticipant> companies = marketParticipantService.getAllCompanies();
        return new ResponseEntity<>(companies, HttpStatus.OK);
    }

    // Endpoint to get a specific company by ID
    @GetMapping("/{id}")
    public ResponseEntity<MarketParticipant> getCompanyById(@PathVariable(value = "id") Long id) {
        Optional<MarketParticipant> company = marketParticipantService.getCompanyById(id);
        return company.map(c -> new ResponseEntity<>(c, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Endpoint to create a new company (POST)
    @PostMapping("/create")
    public ResponseEntity<MarketParticipant> createCompany(@RequestBody MarketParticipant company) {
        // Assuming the service layer takes care of saving the company
        MarketParticipant createdCompany = marketParticipantService.saveCompany(company);
        return new ResponseEntity<>(createdCompany, HttpStatus.CREATED);
    }

    // Endpoint to update a company (PUT)
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

    // Endpoint to delete a company (DELETE)
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
