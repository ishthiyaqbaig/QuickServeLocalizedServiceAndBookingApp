package com.example.backend.services;

import com.example.backend.entity.ServiceCategory;
import com.example.backend.repositories.ServiceCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceCategoryService {
    private final ServiceCategoryRepository repo;
    public ServiceCategoryService(ServiceCategoryRepository repo) {
        this.repo = repo;
    }

    public List<ServiceCategory> getAll() {
        return repo.findAll();
    }
    public ServiceCategory create(ServiceCategory c) {
        return repo.save(c);
    }
}