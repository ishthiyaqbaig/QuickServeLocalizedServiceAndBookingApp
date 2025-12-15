package com.example.backend.entity;


import com.example.backend.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;



@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String password;

    @Transient
    private String confirmPassword;

    @Column(columnDefinition = "TEXT")
    private String image; // Cloudinary URL

    @Enumerated(EnumType.STRING)
    private Role role;

    private Long number;
    private Double permanentLatitude;
    private Double permanentLongitude;
    private String permanentAddress;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}


