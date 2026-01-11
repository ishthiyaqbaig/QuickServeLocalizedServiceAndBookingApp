package com.example.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CustomerBookingResponse {

    private Long bookingId;
    private String serviceName;
    private LocalDate bookingDate;
    private String timeSlot;
    private String status;
    private BigDecimal price;

    // Provider Info (SAFE)
    private Long providerId;
    private String providerName;
    private String providerAddress;
    private Long number;
}
