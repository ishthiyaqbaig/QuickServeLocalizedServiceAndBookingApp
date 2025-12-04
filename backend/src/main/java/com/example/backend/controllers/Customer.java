package com.example.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
public class Customer {

    @GetMapping("/dashboard")
    public String customerDashboard() {
        return "Customer Dashboard";
    }
}