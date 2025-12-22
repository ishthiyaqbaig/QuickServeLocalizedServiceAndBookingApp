package com.example.backend.services;

import com.example.backend.dto.BookingResponseDTO;
import com.example.backend.dto.CreateBookingRequest;
import com.example.backend.entity.Booking;
import com.example.backend.entity.ProviderAvailability;
import com.example.backend.enums.BookingStatus;
import com.example.backend.enums.DayEnum;
import com.example.backend.repositories.BookingRepository;
import com.example.backend.repositories.ListingRepository;
import com.example.backend.repositories.ProviderAvailabilityRepository;
import com.example.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ProviderAvailabilityRepository providerAvailabilityRepository;
    private final UserRepository userRepository;
    private final ListingRepository listingRepository;

    @Transactional
    public Booking createBooking(Long customerId, CreateBookingRequest req) {

        // Check double booking
        if (bookingRepository.existsByProviderIdAndBookingDateAndTimeSlot(
                req.getProviderId(),
                req.getBookingDate(),
                req.getTimeSlot())) {
            throw new RuntimeException("Time slot already booked");
        }

        // Check provider availability
        DayEnum day = req.getBookingDate().getDayOfWeek()
                .name()
                .equals("MONDAY") ? DayEnum.MONDAY
                        : DayEnum.valueOf(
                                req.getBookingDate().getDayOfWeek().name());

        ProviderAvailability availability = providerAvailabilityRepository.findByProviderIdAndDay(
                req.getProviderId(), day).orElseThrow(() -> new RuntimeException("Provider not available"));

        if (!availability.getTimeSlots().contains(req.getTimeSlot())) {
            throw new RuntimeException("Selected slot not available");
        }

        // Save booking
        Booking booking = new Booking();
        booking.setCustomerId(customerId);
        booking.setProviderId(req.getProviderId());
        booking.setListingId(req.getListingId());
        booking.setBookingDate(req.getBookingDate());
        booking.setTimeSlot(req.getTimeSlot());
        booking.setStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    // PROVIDER → CONFIRM
    public Booking confirmBooking(Long bookingId) {
        Booking booking = getBooking(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be confirmed");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    // PROVIDER → COMPLETE
    public Booking completeBooking(Long bookingId) {
        Booking booking = getBooking(bookingId);

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed bookings can be completed");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        return bookingRepository.save(booking);
    }

    // CUSTOMER / PROVIDER → CANCEL
    public Booking cancelBooking(Long bookingId) {
        Booking booking = getBooking(bookingId);

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Completed bookings cannot be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    private Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<BookingResponseDTO> findByCustomerId(Long customerId) {
        List<Booking> bookings = bookingRepository.findByCustomerId(customerId);
        return bookings.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> findByProviderId(Long providerId) {
        List<Booking> bookings = bookingRepository.findByProviderId(providerId);
        return bookings.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private BookingResponseDTO mapToResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setCustomerId(booking.getCustomerId());
        dto.setProviderId(booking.getProviderId());
        dto.setListingId(booking.getListingId());
        dto.setBookingDate(booking.getBookingDate());
        dto.setTimeSlot(booking.getTimeSlot());
        dto.setStatus(booking.getStatus());
        dto.setCreatedAt(booking.getCreatedAt());

        // Fetch Customer details
        userRepository.findById(booking.getCustomerId()).ifPresent(customer -> {
            dto.setCustomerName(customer.getUserName());
            dto.setCustomerEmail(customer.getEmail());
            dto.setCustomerAddress(customer.getPermanentAddress());
            dto.setCustomerPhone(customer.getNumber());
        });

        // Fetch Provider details
        userRepository.findById(booking.getProviderId()).ifPresent(provider -> {
            dto.setProviderName(provider.getUserName());
            dto.setProviderEmail(provider.getEmail());
            dto.setProviderAddress(provider.getPermanentAddress());
            dto.setProviderPhone(provider.getNumber());
        });

        // Fetch Listing details
        listingRepository.findById(booking.getListingId()).ifPresent(listing -> {
            dto.setServiceName(listing.getTitle());
            dto.setServiceDescription(listing.getDescription());
            dto.setPrice(listing.getPrice());
            dto.setServiceImage(listing.getImages());
        });

        return dto;
    }
}
