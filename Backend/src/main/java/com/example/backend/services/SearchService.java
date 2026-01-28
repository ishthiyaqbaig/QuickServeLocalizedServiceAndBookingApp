package com.example.backend.services;

import com.example.backend.entity.Listing;
import com.example.backend.repositories.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final ListingRepository listingRepository;

//     Find nearest listings based on user coordinates
    public List<Listing> findNearestListings(Double userLat, Double userLng, Long categoryId) {
        return listingRepository.findNearestListings(userLat, userLng, categoryId);
    }
}
