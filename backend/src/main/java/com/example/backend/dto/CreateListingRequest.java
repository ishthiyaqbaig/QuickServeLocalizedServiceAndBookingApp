package com.example.backend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class CreateListingRequest {

    private Long categoryId;
    private String title;
    private String description;
    private BigDecimal price;

    private MultipartFile image;

    //  LOCATION FIELDS
    private Double permanentLatitude;
    private Double permanentLongitude;
    private String permanentAddress;
}
