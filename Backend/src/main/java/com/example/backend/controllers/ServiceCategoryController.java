package com.example.backend.controllers;
import com.example.backend.entity.ServiceCategory;
import com.example.backend.services.ServiceCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/service_categories")
@RequiredArgsConstructor
public class ServiceCategoryController {
   private final ServiceCategoryService service;
   @GetMapping
    public ResponseEntity<List<ServiceCategory>> all() { return ResponseEntity.ok(service.getAll());}
}