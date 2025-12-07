package com.example.backend.dto;

import lombok.Data;

@Data
public class UpdatePermanentLocationRequest {
    private Double latitude;
    private Double longitude;
    private String address;
}
