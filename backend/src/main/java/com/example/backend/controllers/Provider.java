package com.example.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/provider")
public class Provider {

    @GetMapping("/dashboard")
    public String providerDashboard() {
        return "Service Provider Dashboard";
    }
}