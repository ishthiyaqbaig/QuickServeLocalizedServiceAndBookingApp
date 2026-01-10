package com.example.backend.entity;

import com.example.backend.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "bookings",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"provider_id", "booking_date", "time_slot"}
        )
)
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private Long providerId;
    private Long listingId;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Column(nullable = false)
    private String timeSlot;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private LocalDateTime createdAt = LocalDateTime.now();
}

