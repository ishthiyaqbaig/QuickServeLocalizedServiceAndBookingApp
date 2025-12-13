package com.example.backend.services;

import com.example.backend.dto.UpdateLocationRequest;
import com.example.backend.dto.UpdateProfileRequest;
import com.example.backend.entity.User;
import com.example.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;

    public User updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (request.getUserName() != null) user.setUserName(request.getUserName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
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
}
