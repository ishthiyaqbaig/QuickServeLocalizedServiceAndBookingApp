package com.example.backend.dto;

import com.example.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserAdminResponse {
    private Long id;
    private String email;
    private String userName;
    private Role role;
    private Long number;

    private Double permanentLatitude;
    private Double permanentLongitude;
    private String permanentAddress;

    private LocalDateTime createdAt;
}
