package com.example.backend.controllers;

import com.example.backend.dto.AnalyticsResponse;
import com.example.backend.dto.UserAdminResponse;
import com.example.backend.dto.UserResponse;
import com.example.backend.entity.Listing;
import com.example.backend.entity.ServiceCategory;
import com.example.backend.entity.User;
import com.example.backend.services.AdminService;
import com.example.backend.services.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AnalyticsService analyticsService;

    @PostMapping("/listings/{listingId}/approve")
    public ResponseEntity<Listing> approve(@PathVariable Long listingId,
                                           @RequestParam Long adminId,
                                           @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(adminService.approveListing(listingId, adminId, reason));
    }

    @PostMapping("/listings/{listingId}/reject")
    public ResponseEntity<Listing> reject(@PathVariable Long listingId,
                                          @RequestParam Long adminId,
                                          @RequestParam String reason) {
        return ResponseEntity.ok(adminService.rejectListing(listingId, adminId, reason));
    }

    @PostMapping("/create-category")
    public ResponseEntity<ServiceCategory> createCategory(@RequestBody ServiceCategory category,
                                                          @RequestParam Long adminId) {
        return ResponseEntity.ok(adminService.createCategory(category, adminId));
    }

    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long categoryId) {
        adminService.deleteCategory(categoryId);
        return ResponseEntity.ok("Category deleted and providers notified.");
    }
    @GetMapping("/categories")
    public ResponseEntity<?> categories() {
        return ResponseEntity.ok(adminService.getCategories());
    }

    @GetMapping("/analytics/top-categories")
    public ResponseEntity<List<AnalyticsResponse>> topCategories() {
        return ResponseEntity.ok(analyticsService.getTopCategories());
    }

    @GetMapping("/analytics/top-services")
    public ResponseEntity<List<AnalyticsResponse>> topServices() {
        return ResponseEntity.ok(analyticsService.getTopServices());
    }

    @GetMapping("/pending/listings")
    public ResponseEntity<List<Listing>> getAllPendingListings() {
        return ResponseEntity.ok(adminService.findAllPendingListings());
    }
    @GetMapping("/approved/listings")
    public ResponseEntity<List<Listing>> getAllApprovedListings() {
        return ResponseEntity.ok(adminService.findAllApprovedListings());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserAdminResponse>> getAllUsers() {
        List<User>users=adminService.findAllUser();
        List<UserAdminResponse> response = users.stream()
                .map(u -> new UserAdminResponse(
                        u.getId(),
                        u.getEmail(),
                        u.getUserName(),
                        u.getRole(),
                        u.getNumber(),
                        u.getPermanentLatitude(),
                        u.getPermanentLongitude(),
                        u.getPermanentAddress(),
                        u.getCreatedAt()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }
}
