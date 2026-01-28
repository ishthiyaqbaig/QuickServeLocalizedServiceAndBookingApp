import api from '../api/client';

export const submitReview = async (bookingId, rating, comment) => {
    const response = await api.post('/customer/reviews', {
        bookingId,
        rating,
        comment
    });
    return response.data;
};

export const getReviewsByBooking = async (bookingId) => {
    const response = await api.get(`/customer/reviews/${bookingId}`);
    return response.data;
};

export const getProviderReviewsByBooking = async (bookingId) => {
    const response = await api.get(`/provider/reviews/${bookingId}`);
    return response.data;
};
