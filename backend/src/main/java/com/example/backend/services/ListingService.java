package com.example.backend.services;

import com.example.backend.dto.CreateListingRequest;
import com.example.backend.entity.Listing;
import com.example.backend.entity.User;
import com.example.backend.repositories.ListingRepository;
import com.example.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public Listing createListing(Long providerId, CreateListingRequest request) {

        //FETCH PROVIDER FROM USERS TABLE
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        // SAVE / UPDATE LOCATION IN USER TABLE
        provider.setPermanentLatitude(request.getPermanentLatitude());
        provider.setPermanentLongitude(request.getPermanentLongitude());
        provider.setPermanentAddress(request.getPermanentAddress());

        userRepository.save(provider);  // LOCATION STORED

        //  UPLOAD IMAGE TO CLOUDINARY
        String imageUrl = cloudinaryService.uploadFile(request.getImage());

        //  CREATE LISTING
        Listing listing = new Listing();
        listing.setProviderId(providerId);
        listing.setCategoryId(request.getCategoryId());
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setImages(imageUrl);   // Cloudinary URL
        listing.setIsApproved(false);  // Admin approval required

        return listingRepository.save(listing);
    }
}
