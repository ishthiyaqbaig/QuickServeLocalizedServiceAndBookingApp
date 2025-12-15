package com.example.backend.services;

import com.example.backend.dto.UpdateLocationRequest;
import com.example.backend.dto.UpdateProfileRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.entity.User;
import com.example.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public User updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String imageUrl = null;
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            imageUrl = cloudinaryService.uploadFile(request.getImage());
        }
        if (request.getUserName() != null) user.setUserName(request.getUserName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getNumber() != null) user.setNumber(request.getNumber());
        if (request.getImage() != null) user.setImage(imageUrl);
        return userRepository.save(user);
    }

    public User updateLocation(Long userId, UpdateLocationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (request.getPermanentLatitude() != null) user.setPermanentLatitude(request.getPermanentLatitude());
        if (request.getPermanentLongitude() != null) user.setPermanentLongitude(request.getPermanentLongitude());
        if (request.getPermanentAddress() != null) user.setPermanentAddress(request.getPermanentAddress());
        return userRepository.save(user);
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUserName(user.getUserName());
        dto.setRole(user.getRole());
        dto.setNumber(user.getNumber());
        dto.setImage(user.getImage());
        dto.setPermanentLatitude(user.getPermanentLatitude());
        dto.setPermanentLongitude(user.getPermanentLongitude());
        dto.setPermanentAddress(user.getPermanentAddress());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
