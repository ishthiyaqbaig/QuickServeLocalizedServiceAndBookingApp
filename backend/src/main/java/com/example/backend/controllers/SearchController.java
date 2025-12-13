package com.example.backend.controllers;

import com.example.backend.entity.Listing;
import com.example.backend.services.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/search")
    public ResponseEntity<List<Listing>> searchNearest(@RequestParam Double lat, @RequestParam Double lng, @RequestParam Long categoryId) {
        System.out.print(lat+" "+lng+" "+categoryId);
        return ResponseEntity.ok(searchService.findNearestListings(lat, lng, categoryId));
    }
}
