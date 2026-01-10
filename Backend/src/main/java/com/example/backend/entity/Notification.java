package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;  // Receiver

    @Column(columnDefinition = "TEXT")
    private String message;

    private Boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}

