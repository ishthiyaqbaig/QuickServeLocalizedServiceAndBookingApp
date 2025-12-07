package com.example.backend.dto;

import com.example.backend.enums.Role;
import lombok.Data;

@Data
public class SignupRequest {
    private String userName;
    private String email;
    private String password;
    private String confirmPassword;
    private Role role;
    private Double latitude;    // Optional manual location
    private Double longitude;   // Optional manual location
    private String address;     // Optional address
}

