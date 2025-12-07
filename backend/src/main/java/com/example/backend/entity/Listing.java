package com.example.backend.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "listings")
@Data
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long providerId;
    private Long categoryId;

    private String title;
    private String description;

    private BigDecimal price;

    private String images; // Cloudinary URL

    private Boolean isApproved = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}

