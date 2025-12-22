package com.example.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProviderBookingResponse {

    private Long bookingId;
    private LocalDate bookingDate;
    private String timeSlot;
    private String status;

    private BigDecimal price;

    // Customer Info (SAFE)
    private Long customerId;
    private String customerName;
    private String customerAddress;
}
