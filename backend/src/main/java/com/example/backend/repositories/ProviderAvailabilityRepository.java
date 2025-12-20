package com.example.backend.repositories;

import com.example.backend.entity.ProviderAvailability;
import com.example.backend.enums.DayEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProviderAvailabilityRepository
        extends JpaRepository<ProviderAvailability, Long> {

    Optional<ProviderAvailability> findByProviderIdAndDay(
            Long providerId,
            DayEnum day
    );
}

