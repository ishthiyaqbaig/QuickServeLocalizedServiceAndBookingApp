package com.example.backend.controllers;

import com.example.backend.dto.CreateListingRequest;
import com.example.backend.entity.Listing;
import com.example.backend.services.ListingService;
import com.example.backend.services.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider")
@RequiredArgsConstructor
public class ProviderController {

    private final ListingService listingService;
    private final SearchService searchService;

    //  Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Provider endpoint working!");
    }

    //  CREATE LISTING WITH CLOUDINARY IMAGE
    @PostMapping("/{providerId}/listings")
    public ResponseEntity<Listing> createListing(
            @PathVariable Long providerId,
            @ModelAttribute CreateListingRequest request) {

        Listing listing = listingService.createListing(providerId, request);
        return ResponseEntity.ok(listing);
    }

    //  SEARCH NEAREST PROVIDERS
    @GetMapping("/search")
    public ResponseEntity<List<Listing>> searchNearest(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam Long categoryId) {

        List<Listing> listings = searchService.findNearestListings(lat, lng, categoryId);
        return ResponseEntity.ok(listings);
    }
}
