package com.example.backend.dto;

import com.example.backend.enums.DayEnum;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import java.util.List;

@Data
public class AvailabilityRequest {

    private DayEnum day; // MONDAY
    private List<String> timeSlots; // ["09:00 AM","10:00 AM"]
}
