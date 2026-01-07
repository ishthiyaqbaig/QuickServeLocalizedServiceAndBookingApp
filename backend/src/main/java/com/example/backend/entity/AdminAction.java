package com.example.backend.entity;

import com.example.backend.enums.AdminActionType;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_actions")
@Data
public class AdminAction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long listingId;
    private Long adminId;

    @Enumerated(EnumType.STRING)
    private AdminActionType actionType;

    @Column(columnDefinition = "TEXT")
    private String reason;

    private LocalDateTime timestamp = LocalDateTime.now();
}
