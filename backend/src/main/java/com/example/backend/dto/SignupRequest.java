package com.example.backend.dto;

import com.example.backend.enums.Role;

public class SignupRequest {
    public String userName;
    public String email;
    public String password;
    public String confirmPassword;
    public Role role;
}
