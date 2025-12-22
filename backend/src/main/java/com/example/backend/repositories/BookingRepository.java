package com.example.backend.repositories;

import com.example.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByProviderIdAndBookingDateAndTimeSlot(
            Long providerId,
            LocalDate bookingDate,
            String timeSlot
    );

    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByProviderId(Long providerId);
}

