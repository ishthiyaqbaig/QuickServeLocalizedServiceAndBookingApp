package com.example.backend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateProfileRequest {
    private String userName;
    private String email;
    private Long number;
    private MultipartFile image;
}
