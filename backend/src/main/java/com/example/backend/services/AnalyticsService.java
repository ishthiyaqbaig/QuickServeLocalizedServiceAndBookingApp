package com.example.backend.services;

import com.example.backend.dto.AnalyticsResponse;
import com.example.backend.entity.Listing;
import com.example.backend.entity.ServiceCategory;
import com.example.backend.repositories.BookingRepository;
import com.example.backend.repositories.ListingRepository;
import com.example.backend.repositories.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final BookingRepository bookingRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final ListingRepository listingRepository;

    public List<AnalyticsResponse> getTopCategories() {
        return bookingRepository.countBookingsByCategory().stream().map(row -> {
                    Long id = (Long) row[0];
                    Long count = (Long) row[1];
                    String name = categoryRepository.findById(id).map(ServiceCategory::getName).orElse("Unknown");
                    return new AnalyticsResponse(id, name, count);
                }).sorted((a, b) -> Long.compare(b.getBookings(), a.getBookings()))
                .collect(Collectors.toList());
    }

    public List<AnalyticsResponse> getTopServices() {
        return bookingRepository.countBookingsByListing().stream().map(row -> {
                    Long id = (Long) row[0];
                    Long count = (Long) row[1];
                    String name = listingRepository.findById(id).map(Listing::getTitle).orElse("Unknown");
                    return new AnalyticsResponse(id, name, count);
                }).sorted((a, b) -> Long.compare(b.getBookings(), a.getBookings()))
                .collect(Collectors.toList());
    }
}
