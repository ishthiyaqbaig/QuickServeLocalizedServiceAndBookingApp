package com.example.backend.repositories;

import com.example.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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

    @Query("""
   SELECT l.categoryId, COUNT(b.id)
   FROM Booking b
   JOIN Listing l ON b.listingId = l.id
   WHERE b.status IN ('CONFIRMED','COMPLETED')
   GROUP BY l.categoryId
""")
    List<Object[]> countBookingsByCategory();

    @Query("SELECT b.listingId, COUNT(b.id) FROM Booking b WHERE b.status IN ('CONFIRMED', 'COMPLETED') GROUP BY b.listingId")
    List<Object[]> countBookingsByListing();
}

