package com.example.backend.services;

import com.example.backend.dto.CreateReviewRequest;
import com.example.backend.entity.Booking;
import com.example.backend.entity.Review;
import com.example.backend.enums.BookingStatus;
import com.example.backend.repositories.BookingRepository;
import com.example.backend.repositories.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public Review submitReview(CreateReviewRequest req) {

        // Ensure booking is completed
        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new IllegalStateException("You can only review a completed booking");
        }

        // Save review
        Review review = new Review();
        review.setBookingId(req.getBookingId());
        review.setRating(req.getRating());
        review.setComment(req.getComment());

        Review saved = reviewRepository.save(review);

        // Notify Provider about rating
        notificationService.sendNotification(
                booking.getProviderId(),
                "You received a " + req.getRating() + "★ rating for booking ID: " + booking.getId()
        );

        return saved;
    }

    public List<Review> getReviewsByBooking(Long bookingId) {
        return reviewRepository.findByBookingId(bookingId);
    }
}