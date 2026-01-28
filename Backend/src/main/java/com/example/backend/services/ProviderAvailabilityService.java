package com.example.backend.services;

import com.example.backend.dto.AvailabilityRequest;
import com.example.backend.entity.ProviderAvailability;
import com.example.backend.enums.DayEnum;
import com.example.backend.repositories.BookingRepository;
import com.example.backend.repositories.ProviderAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderAvailabilityService {

    private final ProviderAvailabilityRepository repository;
    private final BookingRepository bookingRepository;

    public void saveOrUpdateAvailability(Long providerId, AvailabilityRequest req) {

        ProviderAvailability availability =
                repository.findByProviderIdAndDay(providerId, req.getDay())
                        .orElse(new ProviderAvailability());

        availability.setProviderId(providerId);
        availability.setDay(req.getDay());
        availability.setTimeSlots(String.join(",", req.getTimeSlots()));

        repository.save(availability);
    }

    public ProviderAvailability getAvailability(Long providerId, DayEnum day) {
        return repository.findByProviderIdAndDay(providerId, day)
                .orElseThrow(() -> new RuntimeException("Availability not set"));
    }

    public void removeTimeSlot(Long providerId, DayEnum day, String slot) {

        ProviderAvailability availability =
                repository.findByProviderIdAndDay(providerId, day)
                        .orElseThrow(() -> new RuntimeException("Availability not found"));

        // Check bookings
        boolean hasBooking = bookingRepository
                .existsByProviderIdAndBookingDateAndTimeSlot(
                        providerId,
                        LocalDate.now(), // actual date mapped from day
                        slot
                );

        if (hasBooking) {
            throw new RuntimeException("Cannot remove slot with active booking");
        }


        List<String> slots = new ArrayList<>(
                Arrays.asList(availability.getTimeSlots().split(","))
        );

        boolean flag=slots.remove(slot);
        if(!flag)throw new RuntimeException(" slot is not Found");
        availability.setTimeSlots(String.join(",", slots));
        repository.save(availability);
    }

}

