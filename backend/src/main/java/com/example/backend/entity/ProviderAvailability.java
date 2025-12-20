package com.example.backend.entity;
import com.example.backend.enums.DayEnum;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(
        name = "provider_availability",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"provider_id", "day"}
        )
)
@Data
public class ProviderAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider_id", nullable = false)
    private Long providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayEnum day;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String timeSlots;
    // Example: "09:00 AM,10:00 AM,02:00 PM"
}
