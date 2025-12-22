package com.example.backend.controllers;

import com.example.backend.dto.BookingResponseDTO;
import com.example.backend.dto.CreateBookingRequest;
import com.example.backend.entity.Booking;
import com.example.backend.entity.Listing;
import com.example.backend.entity.ProviderAvailability;
import com.example.backend.enums.DayEnum;
import com.example.backend.services.BookingService;
import com.example.backend.services.ProviderAvailabilityService;
import com.example.backend.services.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final SearchService searchService;
    private final BookingService bookingService;
    private final ProviderAvailabilityService providerAvailabilityService;

    // Search

    @GetMapping("/search")
    public ResponseEntity<List<Listing>> searchNearest(@RequestParam Double lat, @RequestParam Double lng,
            @RequestParam Long categoryId) {
        System.out.print(lat + " " + lng + " " + categoryId);
        return ResponseEntity.ok(searchService.findNearestListings(lat, lng, categoryId));
    }

    // Booking
    @PostMapping("/bookings/{customerId}")
    public ResponseEntity<Booking> createBooking(
            @PathVariable Long customerId,
            @RequestBody CreateBookingRequest req) {
        return ResponseEntity.ok(bookingService.createBooking(customerId, req));
    }

    @PostMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId));
    }

    @GetMapping("/bookings/{customerId}")
    public ResponseEntity<List<BookingResponseDTO>> myBookings(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(
                bookingService.findByCustomerId(customerId));
    }

    // availability
    @GetMapping("/availability/{providerId}")
    public ResponseEntity<ProviderAvailability> getAvailability(
            @PathVariable Long providerId,
            @RequestParam DayEnum day) {
        return ResponseEntity.ok(
                providerAvailabilityService.getAvailability(providerId, day));
    }
}
