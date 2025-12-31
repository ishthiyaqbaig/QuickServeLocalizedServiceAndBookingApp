package com.example.backend.dto;

import lombok.Data;

@Data
public class CreateReviewRequest {
    private Long bookingId;
    private int rating; // 1-5
    private String comment;
}