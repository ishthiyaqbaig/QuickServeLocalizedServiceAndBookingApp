package com.example.backend.repositories;

import com.example.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBookingId(Long bookingId);
}
