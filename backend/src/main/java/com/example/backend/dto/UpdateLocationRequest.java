package com.example.backend.dto;

import lombok.Data;

@Data
public class UpdateLocationRequest {
    private Double permanentLatitude;
    private Double permanentLongitude;
    private String permanentAddress;
}
