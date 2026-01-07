import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { createBooking, getCustomerViewAvailability } from '../services/bookingService';

const BookingModal = ({ isOpen, onClose, service, userId }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const [success, setSuccess] = useState(false);

    // Helper to get DAY string from date
    const getDayFromDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return days[date.getDay()];
    };

    const effectiveProviderId = service?.providerId || service?.provider_id || service?.shopId || service?.userId;
    const effectiveListingId = service?.id || service?.listing_id;

    // Fetch availability slots when date changes
    useEffect(() => {
        const day = getDayFromDate(selectedDate);
        if (effectiveProviderId && day && isOpen) {
            setLoading(true);
            getCustomerViewAvailability(effectiveProviderId, day)
                .then(slots => {
                    setTimeSlots(Array.isArray(slots) ? slots : []);
                })
                .catch(err => {
                    console.error("Could not fetch slots", err);
                    setTimeSlots([]);
                })
                .finally(() => setLoading(false));
        } else {
            setTimeSlots([]);
        }
    }, [effectiveProviderId, selectedDate, isOpen]);

    if (!isOpen || !service) return null;

    const handleConfirm = async () => {
        if (!selectedDate || !selectedSlot || !userId || !effectiveProviderId) return;

        setLoading(true);
        try {
            const bookingData = {
                providerId: effectiveProviderId,
                listingId: effectiveListingId,
                bookingDate: selectedDate,
                timeSlot: selectedSlot
            };

            await createBooking(userId, bookingData);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2000);
            
        } catch (err) {
            alert(err.response?.data?.message || "Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-900">Book Service</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle size={32} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">Booking Confirmed!</h4>
                                <p className="text-gray-500">Your request has been sent to the provider.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Service Info */}
                            <div className="flex gap-4">
                                <div className="h-16 w-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={service.images} alt={service.title} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{service.title}</h4>
                                    <p className="text-blue-600 font-bold">₹{service.price}</p>
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar size={16} /> Select Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={selectedDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setSelectedSlot(null); // Reset slot
                                    }}
                                />
                            </div>

                            {/* Time Slots */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Clock size={16} /> Select Time
                                </label>

                                {!selectedDate ? (
                                    <div className="text-sm text-gray-500 italic p-2 bg-gray-50 rounded">
                                        Please select a date first.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {loading ? (
                                            <div className="flex items-center justify-center py-4">
                                                <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                                            </div>
                                        ) : Array.isArray(timeSlots) && timeSlots.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-2">
                                                {timeSlots.map(slot => {
                                                    const isSelected = selectedSlot === slot;
                                                    return (
                                                        <button
                                                            key={slot}
                                                            onClick={() => setSelectedSlot(slot)}
                                                            className={`
                                                                py-2 px-1 text-sm rounded-lg border transition-all
                                                                ${isSelected
                                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                                    : 'bg-white text-gray-700 border-gray-100 hover:border-blue-500 hover:text-blue-600'
                                                                }
                                                            `}
                                                        >
                                                            {slot}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                                                No availability found for this day.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Error display if missing data */}
                            {!effectiveProviderId && (
                                <p className="text-[10px] text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 text-center">
                                    Error: Service provider details are missing. Please contact support.
                                </p>
                            )}

                            {/* Confirm Button */}
                            <div className="space-y-2">
                                <Button
                                    className="w-full mt-2"
                                    onClick={handleConfirm}
                                    disabled={!selectedDate || !selectedSlot || loading || !effectiveProviderId || !userId}
                                >
                                    {loading ? "Processing..." : "Confirm Booking"}
                                </Button>

                                {effectiveProviderId && (!selectedDate || !selectedSlot) && !loading && (
                                    <p className="text-[10px] text-gray-500 text-center font-medium">
                                        {!selectedDate ? "📅 Pick a date" : "🕒 Pick a time slot"}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
