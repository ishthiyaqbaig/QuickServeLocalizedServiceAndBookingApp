package com.example.backend.controllers;

import com.example.backend.dto.CreateListingRequest;
import com.example.backend.dto.UpdateListingRequest;
import com.example.backend.entity.Listing;
import com.example.backend.services.ListingService;
import com.example.backend.services.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider")
@RequiredArgsConstructor
public class ProviderController {

    private final ListingService listingService;
    private final SearchService searchService;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Provider endpoint working!");
    }

    @PostMapping("/{providerId}/listings")
    public ResponseEntity<Listing> createListing(
            @PathVariable Long providerId,
            @ModelAttribute CreateListingRequest request) {

        Listing listing = listingService.createListing(providerId, request);
        return ResponseEntity.ok(listing);
    }

    @GetMapping("/{providerId}/listings")
    public ResponseEntity<List<Listing>> getAllListing(
            @PathVariable Long providerId) {

        List<Listing>listings = listingService.getListingsByProvider(providerId);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{listingId}/listing")
    public ResponseEntity<Listing> getListing(
            @PathVariable Long listingId) {
        Listing listing = listingService.getListing(listingId);
        return ResponseEntity.ok(listing);
    }

    @PutMapping("/listings/{listingId}")
    public ResponseEntity<Listing>updateListing(
            @PathVariable Long listingId,
            @ModelAttribute UpdateListingRequest request
    ) {

        Listing listing = listingService.updateListing(listingId,request);
        return ResponseEntity.ok(listing);
    }

    @DeleteMapping("/listings/{listingId}")
    public ResponseEntity<?> deleteListing(
            @PathVariable Long listingId
    ) {

        listingService.deleteListing(listingId);
        return ResponseEntity.ok("deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Listing>> searchNearest(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam Long categoryId) {

        List<Listing> listings = searchService.findNearestListings(lat, lng, categoryId);
        return ResponseEntity.ok(listings);
    }
}
