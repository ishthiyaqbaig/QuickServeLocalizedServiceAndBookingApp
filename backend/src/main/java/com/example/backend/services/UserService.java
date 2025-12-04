package com.example.backend.services;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.SignupRequest;
import com.example.backend.entity.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {

    User registerUser(SignupRequest request);

    AuthResponse login(LoginRequest request);
}
