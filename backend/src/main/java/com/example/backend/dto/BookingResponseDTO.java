package com.example.backend.dto;

import com.example.backend.enums.BookingStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BookingResponseDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerAddress;
    private Long customerPhone;

    private Long providerId;
    private String providerName;
    private String providerEmail;
    private String providerAddress;
    private Long providerPhone;

    private Long listingId;
    private String serviceName;
    private String serviceDescription;
    private BigDecimal price;
    private String serviceImage;

    private LocalDate bookingDate;
    private String timeSlot;
    private BookingStatus status;
    private LocalDateTime createdAt;
}

