package com.example.backend.services;

import com.example.backend.entity.*;
import com.example.backend.enums.AdminActionType;
import com.example.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ListingRepository listingRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final AnalyticsRepository analyticsRepository;
    private final AdminActionRepository adminActionRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public Listing approveListing(Long listingId, Long adminId, String reason) {
        Listing listing = listingRepository.findById(listingId).orElseThrow();
        listing.setIsApproved(true);
        listingRepository.save(listing);

        AdminAction action = new AdminAction();
        action.setListingId(listingId);
        action.setAdminId(adminId);
        action.setActionType(AdminActionType.APPROVE);
        action.setReason(reason);
        adminActionRepository.save(action);

        logEvent("LISTING_APPROVED", adminId, listingId, null);

        notificationService.sendNotification(listing.getProviderId(), "Your listing is approved by Admin.");

        return listing;
    }

    public Listing rejectListing(Long listingId, Long adminId, String reason) {
        Listing listing = listingRepository.findById(listingId).orElseThrow();
        listing.setIsApproved(false);
        listingRepository.save(listing);

        AdminAction action = new AdminAction();
        action.setListingId(listingId);
        action.setAdminId(adminId);
        action.setActionType(AdminActionType.REJECT);
        action.setReason(reason);
        adminActionRepository.save(action);

        logEvent("LISTING_REJECTED", adminId, listingId, null);

        notificationService.sendNotification(listing.getProviderId(), "Your listing is rejected by Admin. Reason: " + reason);

        return listing;
    }

    public ServiceCategory createCategory(ServiceCategory category, Long adminId) {
        ServiceCategory saved = categoryRepository.save(category);
        logEvent("CATEGORY_CREATED", adminId, null, saved.getId());
        return saved;
    }

    public void deleteCategory(Long categoryId) {
        ServiceCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        categoryRepository.delete(category);

        // Notify all providers
        String message = "The service category '" + category.getName() + "' has been removed by Admin.";
        notificationService.notifyAllProviders(message);
    }

    public List<ServiceCategory> getCategories() {
        return categoryRepository.findAll();
    }

    private void logEvent(String eventType, Long userId, Long listingId, Long categoryId) {
        Analytics a = new Analytics();
        a.setEventType(eventType);
        a.setUserId(userId);
        a.setListingId(listingId);
        a.setCategoryId(categoryId);
        analyticsRepository.save(a);
    }

   public List<User>findAllUser(){
        return userRepository.findAll();
    }

    public List<Listing>findAllPendingListings(){
        return listingRepository.findByIsApprovedFalse();
    }
    public List<Listing>findAllApprovedListings(){
        return listingRepository.findByIsApprovedTrue();
    }
}
