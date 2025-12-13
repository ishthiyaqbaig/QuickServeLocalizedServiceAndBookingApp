package com.example.backend.services;

import com.example.backend.dto.CreateListingRequest;
import com.example.backend.dto.UpdateListingRequest;
import com.example.backend.entity.Listing;
import com.example.backend.entity.User;
import com.example.backend.repositories.ListingRepository;
import com.example.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public Listing createListing(Long providerId, CreateListingRequest request) {
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        // ensure provider may have location or not (we decided listing doesn't require)
        String imageUrl = null;
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            imageUrl = cloudinaryService.uploadFile(request.getImage());
        }

        Listing listing = new Listing();
        listing.setProviderId(providerId);
        listing.setCategoryId(request.getCategoryId());
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setImages(imageUrl);
        listing.setIsApproved(false); // admin must approve

        return listingRepository.save(listing);
    }

    @Transactional
    public Listing updateListing(Long listingId, UpdateListingRequest request) {
        Listing l = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (request.getCategoryId() != null) l.setCategoryId(request.getCategoryId());
        if (request.getTitle() != null) l.setTitle(request.getTitle());
        if (request.getDescription() != null) l.setDescription(request.getDescription());
        if (request.getPrice() != null) l.setPrice(request.getPrice());

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String newUrl = cloudinaryService.uploadFile(request.getImage());
            l.setImages(newUrl);
        }

        return listingRepository.save(l);
    }

    public void deleteListing(Long listingId) {
        listingRepository.deleteById(listingId);
    }

    public List<Listing> getListingsByProvider(Long providerId) {
        return listingRepository.findByProviderId(providerId);
    }

    public Listing getListing(Long id) {
        return listingRepository.findById(id).orElseThrow(() -> new RuntimeException("Listing not found"));
    }

    public Listing setApproval(Long listingId, boolean approve) {
        Listing l = getListing(listingId);
        l.setIsApproved(approve);
        return listingRepository.save(l);
    }
}
