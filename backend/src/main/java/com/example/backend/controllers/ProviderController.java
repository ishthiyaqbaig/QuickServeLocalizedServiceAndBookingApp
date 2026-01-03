package com.example.backend.controllers;

import com.example.backend.dto.AvailabilityRequest;
import com.example.backend.dto.CreateListingRequest;
import com.example.backend.dto.RemoveSlotRequest;
import com.example.backend.dto.UpdateListingRequest;
import com.example.backend.entity.Booking;
import com.example.backend.entity.Listing;
import com.example.backend.entity.ProviderAvailability;
import com.example.backend.enums.DayEnum;
import com.example.backend.services.BookingService;
import com.example.backend.services.ListingService;
import com.example.backend.services.ProviderAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider")
@RequiredArgsConstructor
public class ProviderController {

    private final ListingService listingService;
    private final BookingService bookingService;
    private final ProviderAvailabilityService providerAvailabilityService;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Provider endpoint working!");
    }

    //Listing
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


    // availability

    @PostMapping("/availability/{providerId}")
    public ResponseEntity<String> setAvailability(
            @PathVariable Long providerId,
            @RequestBody AvailabilityRequest req
    ) {
        providerAvailabilityService.saveOrUpdateAvailability(providerId, req);
        return ResponseEntity.ok("Availability saved");
    }

    @GetMapping("/availability/{providerId}")
    public ResponseEntity<ProviderAvailability> getAvailability(
            @PathVariable Long providerId,
            @RequestParam DayEnum day
    ) {
        return ResponseEntity.ok(
                providerAvailabilityService.getAvailability(providerId, day)
        );
    }

    @DeleteMapping("/availability/{providerId}/slot")
    public ResponseEntity<String> deleteSlot(
            @PathVariable Long providerId,
            @RequestBody RemoveSlotRequest req
    ) {
        providerAvailabilityService.removeTimeSlot(
                providerId,
                req.getDay(),
                req.getTimeSlot()
        );
        return ResponseEntity.ok("Slot removed");
    }


    // Booking

    @GetMapping("/bookings/{providerId}")
    public ResponseEntity<?> providerBookings(
            @PathVariable Long providerId
    ) {
        return ResponseEntity.ok(bookingService.getProviderBookings(providerId));
    }

    @PostMapping("/bookings/{bookingId}/confirm")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.confirmBooking(bookingId));
    }

    @PostMapping("/bookings/{bookingId}/complete")
    public ResponseEntity<Booking> completeBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.completeBooking(bookingId));
    }

    @PostMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId,"Provider"));
    }

}

