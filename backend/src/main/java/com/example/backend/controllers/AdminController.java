package com.example.backend.controllers;

import com.example.backend.entity.Listing;
import com.example.backend.entity.ServiceCategory;
import com.example.backend.services.ListingService;
import com.example.backend.services.ServiceCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ListingService listingService;
    private final ServiceCategoryService serviceCategoryService;

    @PostMapping("/listings/{listingId}/approve")
    public ResponseEntity<Listing> approveListing(@PathVariable Long listingId) {
        Listing l = listingService.setApproval(listingId, true);
        return ResponseEntity.ok(l);
    }

    @PostMapping("/listings/{listingId}/reject")
    public ResponseEntity<Listing> rejectListing(@PathVariable Long listingId) {
        Listing l = listingService.setApproval(listingId, false);
        return ResponseEntity.ok(l);
    }
    @PostMapping("/create-category")
    public ResponseEntity<ServiceCategory> createServiceCategory(@RequestBody ServiceCategory serviceCategory) {
        ServiceCategory serviceCategory1 = serviceCategoryService.create(serviceCategory);
        return ResponseEntity.ok(serviceCategory1);
    }
}
