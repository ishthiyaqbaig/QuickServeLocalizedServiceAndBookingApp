import apiClient from '../api/client';

// --- Provider Availability APIs ---

/**
 * Create or update availability for a specific day
 * POST /api/provider/availability/{providerId}
 */
export const updateProviderAvailability = async (providerId, day, timeSlots) => {
    try {
        const response = await apiClient.post(`/provider/availability/${providerId}`, {
            day: day.toUpperCase(),
            timeSlots
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update availability", error);
        throw error;
    }
};

/**
 * Get availability for a specific day
 * GET /api/provider/availability/{providerId}?day=MONDAY
 */
export const getProviderAvailability = async (providerId, day) => {
    try {
        const response = await apiClient.get(`/provider/availability/${providerId}`, {
            params: { day: day.toUpperCase() }
        });
        // Safety check: handle array, object with array, or object with comma-separated string
        const data = response.data;
        if (Array.isArray(data)) return data;
        if (data) {
            if (Array.isArray(data.timeSlots)) return data.timeSlots;
            if (typeof data.timeSlots === 'string') {
                return data.timeSlots.split(',').filter(s => s.trim() !== "");
            }
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch availability", error);
        return [];
    }
};

/**
 * Remove a specific time slot
 * DELETE /api/provider/availability/{providerId}/slot
 */
export const removeAvailabilitySlot = async (providerId, day, timeSlot) => {
    try {
        const response = await apiClient.delete(`/provider/availability/${providerId}/slot`, {
            data: { day: day.toUpperCase(), timeSlot }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to remove availability slot", error);
        throw error;
    }
};

/**
 * Customer view of provider availability (shows only available slots)
 * GET /api/customer/availability/{providerId}?day=MONDAY
 */
export const getCustomerViewAvailability = async (providerId, day) => {
    try {
        const response = await apiClient.get(`/customer/availability/${providerId}`, {
            params: { day: day.toUpperCase() }
        });
        // Safety check: handle array, object with array, or object with comma-separated string
        const data = response.data;
        if (Array.isArray(data)) return data;
        if (data) {
            if (Array.isArray(data.timeSlots)) return data.timeSlots;
            if (typeof data.timeSlots === 'string') {
                return data.timeSlots.split(',').filter(s => s.trim() !== "");
            }
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch customer view availability", error);
        return [];
    }
};

// --- Booking APIs ---

/**
 * Create a new booking
 * POST /api/customer/bookings/{customerId}
 */
export const createBooking = async (customerId, bookingData) => {
    try {
        const response = await apiClient.post(`/customer/bookings/${customerId}`, bookingData);
        return response.data;
    } catch (error) {
        console.error("Failed to create booking", error);
        throw error;
    }
};

/**
 * Fetch bookings for a provider
 * GET /api/provider/bookings/{providerId}
 */
export const getBookingsByProvider = async (providerId) => {
    try {
        const response = await apiClient.get(`/provider/bookings/${providerId}`);
        return response.data || [];
    } catch (error) {
        console.error("Failed to fetch provider bookings", error);
        return [];
    }
};

/**
 * Fetch bookings for a customer
 * GET /api/customer/bookings/{customerId}
 */
export const getBookingsByCustomer = async (customerId) => {
    try {
        const response = await apiClient.get(`/customer/bookings/${customerId}`);
        return response.data || [];
    } catch (error) {
        console.error("Failed to fetch customer bookings", error);
        return [];
    }
};

// --- Booking Lifecycle Actions ---

/**
 * Confirm a booking
 * POST /api/provider/bookings/{bookingId}/confirm
 */
export const confirmBooking = async (bookingId) => {
    try {
        const response = await apiClient.post(`/provider/bookings/${bookingId}/confirm`);
        return response.data;
    } catch (error) {
        console.error("Failed to confirm booking", error);
        throw error;
    }
};

/**
 * Complete a booking
 * POST /api/provider/bookings/{bookingId}/complete
 */
export const completeBooking = async (bookingId) => {
    try {
        const response = await apiClient.post(`/provider/bookings/${bookingId}/complete`);
        return response.data;
    } catch (error) {
        console.error("Failed to complete booking", error);
        throw error;
    }
};

/**
 * Provider cancels a booking
 * POST /api/provider/bookings/{bookingId}/cancel
 */
export const providerCancelBooking = async (bookingId) => {
    try {
        const response = await apiClient.post(`/provider/bookings/${bookingId}/cancel`);
        return response.data;
    } catch (error) {
        console.error("Failed to cancel booking (provider)", error);
        throw error;
    }
};

/**
 * Customer cancels a booking
 * POST /api/customer/bookings/{bookingId}/cancel
 */
export const customerCancelBooking = async (bookingId) => {
    try {
        const response = await apiClient.post(`/customer/bookings/${bookingId}/cancel`);
        return response.data;
    } catch (error) {
        console.error("Failed to cancel booking (customer)", error);
        throw error;
    }
};

// Aliases for retro-compatibility where applicable or to be replaced in next steps
export const getServiceSlots = getCustomerViewAvailability;
export const updateServiceSlots = (serviceId, date, slots) => {
    // Note: The API uses providerId and DAY. We need to map serviceId -> providerId and date -> DAY
    // For now, we will handle this mapping in the components or refactor them.
    console.warn("updateServiceSlots is deprecated. Use updateProviderAvailability instead.");
};
