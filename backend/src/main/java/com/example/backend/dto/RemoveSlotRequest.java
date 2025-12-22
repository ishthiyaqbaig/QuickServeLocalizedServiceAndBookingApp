package com.example.backend.dto;

import com.example.backend.enums.DayEnum;
import lombok.Data;

@Data
public class RemoveSlotRequest {

    private DayEnum day;      // MONDAY, TUESDAY
    private String timeSlot;  // "10:00 AM"
}
