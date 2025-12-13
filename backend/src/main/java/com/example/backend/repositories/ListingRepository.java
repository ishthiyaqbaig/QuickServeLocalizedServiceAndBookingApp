package com.example.backend.repositories;

import com.example.backend.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    @Query(value = """
        SELECT l.*
        FROM listings l
        JOIN users u ON u.id = l.provider_id
        WHERE l.category_id = :categoryId
          AND l.is_approved = true
        ORDER BY (
           6371 * acos(
               cos(radians(:lat)) * cos(radians(u.permanent_latitude)) *
               cos(radians(u.permanent_longitude) - radians(:lng)) +
               sin(radians(:lat)) * sin(radians(u.permanent_latitude))
           )
        )
        LIMIT 20
        """, nativeQuery = true)
    List<Listing> findNearestListings(
            @Param("lat") Double lat,
            @Param("lng") Double lng,
            @Param("categoryId") Long categoryId
    );
    List<Listing> findByProviderId(Long providerId);
}
