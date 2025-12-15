package com.example.backend.controllers;

import com.example.backend.dto.UpdateLocationRequest;
import com.example.backend.dto.UpdateProfileRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.entity.User;
import com.example.backend.services.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PutMapping("/{userId}/profile")
    public ResponseEntity<User> updateProfile(@PathVariable Long userId, @ModelAttribute UpdateProfileRequest req) {
        return ResponseEntity.ok(userProfileService.updateProfile(userId, req));
    }

    @PutMapping("/{userId}/location")
    public ResponseEntity<User> updateLocation(@PathVariable Long userId, @RequestBody UpdateLocationRequest req) {
        return ResponseEntity.ok(userProfileService.updateLocation(userId, req));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userProfileService.getUserById(userId));
    }
}
