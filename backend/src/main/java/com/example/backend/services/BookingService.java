package com.example.backend.services;

import com.example.backend.dto.CreateBookingRequest;
import com.example.backend.dto.CustomerBookingResponse;
import com.example.backend.dto.ProviderBookingResponse;
import com.example.backend.entity.Booking;
import com.example.backend.entity.Listing;
import com.example.backend.entity.ProviderAvailability;
import com.example.backend.entity.User;
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

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ProviderAvailabilityRepository providerAvailabilityRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    @Transactional
    public Booking createBooking(Long customerId, CreateBookingRequest req) {

        //  Check double booking
        if (bookingRepository.existsByProviderIdAndBookingDateAndTimeSlot(
                req.getProviderId(),
                req.getBookingDate(),
                req.getTimeSlot()
        )) {
            throw new RuntimeException("Time slot already booked");
        }

        //  Check provider availability
        DayEnum day = req.getBookingDate().getDayOfWeek()
                .name()
                .equals("MONDAY") ? DayEnum.MONDAY : DayEnum.valueOf(
                req.getBookingDate().getDayOfWeek().name()
        );

        ProviderAvailability availability =
                providerAvailabilityRepository.findByProviderIdAndDay(
                        req.getProviderId(), day
                ).orElseThrow(() -> new RuntimeException("Provider not available"));

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

    public List<CustomerBookingResponse> getCustomerBookings(Long customerId) {

        List<Booking> bookings = bookingRepository.findByCustomerId(customerId);

        return bookings.stream().map(booking -> {

            Listing listing = listingRepository
                    .findById(booking.getListingId())
                    .orElseThrow();

            User provider = userRepository
                    .findById(booking.getProviderId())
                    .orElseThrow();

            CustomerBookingResponse res = new CustomerBookingResponse();
            res.setBookingId(booking.getId());
            res.setServiceName(listing.getTitle());
            res.setBookingDate(booking.getBookingDate());
            res.setTimeSlot(booking.getTimeSlot());
            res.setStatus(booking.getStatus().name());
            res.setPrice(listing.getPrice());

            res.setProviderId(provider.getId());
            res.setProviderName(provider.getUserName());
            res.setProviderAddress(provider.getPermanentAddress());

            return res;
        }).toList();
    }

    public List<ProviderBookingResponse> getProviderBookings(Long providerId) {

        List<Booking> bookings = bookingRepository.findByProviderId(providerId);

        return bookings.stream().map(booking -> {

            User customer = userRepository
                    .findById(booking.getCustomerId())
                    .orElseThrow();

            Listing listing = listingRepository
                    .findById(booking.getListingId())
                    .orElseThrow();

            ProviderBookingResponse res = new ProviderBookingResponse();
            res.setBookingId(booking.getId());
            res.setBookingDate(booking.getBookingDate());
            res.setTimeSlot(booking.getTimeSlot());
            res.setStatus(booking.getStatus().name());
            res.setPrice(listing.getPrice());

            res.setCustomerId(customer.getId());
            res.setCustomerName(customer.getUserName());
            res.setCustomerAddress(customer.getPermanentAddress());

            return res;
        }).toList();
    }



}
