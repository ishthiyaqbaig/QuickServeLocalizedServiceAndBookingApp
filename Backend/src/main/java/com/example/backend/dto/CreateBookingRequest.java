package com.example.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateBookingRequest {

    private Long providerId;
    private Long listingId;
    private LocalDate bookingDate;
    private String timeSlot;
}
