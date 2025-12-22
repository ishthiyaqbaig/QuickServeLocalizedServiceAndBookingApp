import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, DollarSign, Plus, Trash2, Edit, Search, Filter, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Navbar } from '../components/layout/Navbar';
import { Select } from '../components/ui/Select';
import { getProviderListings, deleteListing } from '../services/providerService';
import { searchProviders } from '../services/customerService';
import { getCategories } from '../services/categoryService';
import {
    getBookingsByProvider,
    confirmBooking,
    completeBooking,
    providerCancelBooking,
    getProviderAvailability,
    updateProviderAvailability,
    removeAvailabilitySlot
} from '../services/bookingService';

const ProviderDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('services');
    const [listings, setListings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // DEBUG: Logs to verify file update and mounting
    useEffect(() => {
        console.log("ProviderDashboard Mounted. Active Tab:", activeTab);
    }, [activeTab]);

    // Marketplace Search State
    const [searchResults, setSearchResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchFilters, setSearchFilters] = useState({
        lat: '', // Ideally get from user location
        lng: '',
        categoryId: ''
    });

    const user = {
        name: localStorage.getItem('userName') || 'Provider',
        role: localStorage.getItem('userRole') || 'PROVIDER',
        id: localStorage.getItem('userId')
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // Fetch Listings
    useEffect(() => {
        const needsListings = activeTab === 'services' || activeTab === 'availability';
        if (needsListings && user.id && listings.length === 0) {
            setLoading(true);
            getProviderListings(user.id)
                .then(data => {
                    setListings(Array.isArray(data) ? data : []);
                    const fetchedListings = Array.isArray(data) ? data : [];
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch listings", err);
                    setError("Could not load listings.");
                    setLoading(false);
                });
        }
    }, [activeTab, user.id]);

    // Fetch Categories for Marketplace
    useEffect(() => {
        if (activeTab === 'marketplace') {
            getCategories().then(data => setCategories(Array.isArray(data) ? data : []));
        }
    }, [activeTab]);

    // Fetch Bookings
    useEffect(() => {
        if (activeTab === 'appointments' && user.id) {
            setLoading(true);
            getBookingsByProvider(user.id)
                .then(data => setBookings(Array.isArray(data) ? data : []))
                .catch(err => console.error("Failed to fetch bookings", err))
                .finally(() => setLoading(false));
        }
    }, [activeTab, user.id]);

    const handleConfirmBooking = async (bookingId) => {
        try {
            await confirmBooking(bookingId);
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'Confirmed' } : b));
        } catch (err) {
            alert("Failed to confirm booking");
        }
    };

    const handleCompleteBooking = async (bookingId) => {
        try {
            await completeBooking(bookingId);
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'Completed' } : b));
        } catch (err) {
            alert("Failed to complete booking");
        }
    };

    const handleProviderCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await providerCancelBooking(bookingId);
                setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
            } catch (err) {
                alert("Failed to cancel booking");
            }
        }
    };

    const handleDeleteListing = async (listingId) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                await deleteListing(listingId);
                setListings(listings.filter(l => l.id !== listingId));
            } catch (err) {
                alert("Failed to delete listing.");
            }
        }
    };

    // Filter Logic for Marketplace
    const handleSearch = () => {
        // Mock geolocation for demo if not set
        const lat = searchFilters.lat || 40.7128;
        const lng = searchFilters.lng || -74.0060;

        if (!searchFilters.categoryId) {
            alert("Please select a category");
            return;
        }

        searchProviders(lat, lng, searchFilters.categoryId)
            .then(data => setSearchResults(data))
            .catch(err => console.error(err));
    };

    const renderServicesTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">My Services</h2>
                <Button onClick={() => navigate('/provider/create-listing')} className="flex items-center gap-2">
                    <Plus size={18} /> Create New
                </Button>
            </div>

            {loading ? (
                <p>Loading services...</p>
            ) : listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map(listing => (
                        <Card key={listing.id} className="overflow-hidden">
                            <div className={`h-48 overflow-hidden bg-gray-100 ${listing.disabled ? 'opacity-50' : ''}`}>
                                {listing.images ? (
                                    <img src={listing.images} alt={listing.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                            </div>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg">{listing.title}</h3>
                                    <span className="font-bold text-blue-600">${listing.price}</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                                <div className="pt-3 border-t flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        className={`${listing.disabled ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'} text-white border-0`}
                                        onClick={() => {
                                            const updatedListings = listings.map(l =>
                                                l.id === listing.id ? { ...l, disabled: !l.disabled } : l
                                            );
                                            setListings(updatedListings);
                                        }}
                                    >
                                        {listing.disabled ? 'Enable' : 'Disable'}
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => navigate(`/provider/update-listing/${listing.id}`)}>
                                        <Edit size={16} />
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteListing(listing.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                    <p className="text-gray-500">You haven't listed any services yet.</p>
                </div>
            )}
        </div>
    );

    const renderAppointmentsTab = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Manage Appointments</h2>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
                    <p>Loading appointments...</p>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">No Appointments Yet</h3>
                    <p className="text-gray-500 mt-2">Your upcoming appointments will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <Card key={booking.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="font-bold text-xl text-gray-900">{booking.serviceName}</h3>
                                        <span className={`px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider border ${booking.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                                            booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                booking.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2"><Calendar size={16} className="text-blue-500" /> {booking.bookingDate}</div>
                                        <div className="flex items-center gap-2"><Clock size={16} className="text-blue-500" /> {booking.timeSlot}</div>
                                        <div className="flex items-center gap-2 font-bold text-blue-600 truncate">₹ {booking.price?booking.price:10000}</div>
                                        <div className="text-gray-400">ID: #{booking.id.toString().slice(-4)}</div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white">
                                                {booking.customerName ? booking.customerName.charAt(0).toUpperCase() : 'C'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{booking.customerName || 'Customer Name'}</p>
                                                <p className="text-[11px] text-gray-500 font-medium">Customer Contact: {booking.customerPhone || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 mt-1">
                                            <MapPin size={12} className="text-gray-400 mt-0.5" />
                                            <span>{booking.customerAddress || 'Location not specified'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto">
                                    {
                                        booking.status === 'PENDING' && (
                                        <>
                                            <Button
                                                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                                onClick={() => handleConfirmBooking(booking.id)}
                                            >
                                                Confirm
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 md:flex-none text-red-600 hover:bg-red-50 border-red-100"
                                                onClick={() => handleProviderCancelBooking(booking.id)}
                                            >
                                                Decline
                                            </Button>
                                        </>
                                    )}
                                    {booking.status === 'Confirmed' && (
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <Button
                                                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                                onClick={() => handleCompleteBooking(booking.id)}
                                            >
                                                Mark as Completed
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 md:flex-none"
                                                onClick={() => handleProviderCancelBooking(booking.id)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                    {booking.status === 'Completed' && (
                                        <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg text-sm">
                                            <CheckCircle size={18} /> Done
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

    const [availableSlots, setAvailableSlots] = useState([]);
    const [savingSlots, setSavingSlots] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
    const [todayAvailability, setTodayAvailability] = useState({}); // { serviceId: [slots] }

    // Fetch Today's Availability for all listings
    useEffect(() => {
        if (activeTab === 'availability' && listings.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const fetchAllToday = async () => {
                const results = {};
                for (const listing of listings) {
                    const slots = await getServiceSlots(listing.id, today);
                    results[listing.id] = slots;
                }
                setTodayAvailability(results);
            };
            fetchAllToday();
        }
    }, [activeTab, listings]);

    // Helper to get DAY string from date
    const getDayFromDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return days[date.getDay()];
    };

    // Fetch Availability Slots for selected service and date (Modal)
    useEffect(() => {
        if (isAvailabilityModalOpen && user.id && selectedDate) {
            setLoading(true);
            const day = getDayFromDate(selectedDate);
            getProviderAvailability(user.id, day)
                .then(slots => {
                    setAvailableSlots(slots);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load slots:", err);
                    setLoading(false);
                });
        }
    }, [isAvailabilityModalOpen, user.id, selectedDate]);

    const handleToggleSlot = (slot) => {
        if (availableSlots.includes(slot)) {
            setAvailableSlots(availableSlots.filter(s => s !== slot));
        } else {
            setAvailableSlots([...availableSlots, slot].sort());
        }
    };

    const handleSaveAvailability = async () => {
        if (!user.id || !selectedDate) return;
        setSavingSlots(true);
        try {
            const day = getDayFromDate(selectedDate);
            await updateProviderAvailability(user.id, day, availableSlots);

            // Update local state if needed (optional feedback)
            alert(`Availability updated for ${day}!`);
            setIsAvailabilityModalOpen(false);
        } catch (err) {
            alert("Failed to save availability.");
        } finally {
            setSavingSlots(false);
        }
    };

    const renderAvailabilityTab = () => {
        if (!loading && listings.length === 0) {
            return (
                <div className="flex flex-col items-center text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 max-w-2xl mx-auto">
                    <AlertCircle size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">No Services Found</h3>
                    <p className="text-gray-500 mt-2 mb-6">You need to create at least one listing before you can manage its availability.</p>
                    <Button onClick={() => setActiveTab('services')} className="px-8 py-3 rounded-xl font-bold">Create a Listing</Button>
                </div>
            );
        }

        const formatSlotRange = (slots) => {
            if (!slots || slots.length === 0) return "Not Available Today";
            if (slots.length === 9) return "All Day (9AM - 5PM)";
            return `${slots[0]} - ${slots[slots.length - 1]}`;
        };

        const allPossibleSlots = [
            "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
            "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
        ];

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Manage Availability</h2>
                        <p className="text-gray-500">Set and track booking slots for each service.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map(listing => (
                        <Card key={listing.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-600 overflow-hidden">
                            <div className="h-32 overflow-hidden bg-gray-100">
                                {listing.images ? (
                                    <img src={listing.images} alt={listing.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <MapPin size={24} />
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{listing.title}</h3>
                                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                        <Clock size={16} />
                                    </div>
                                </div>
                                <Button
                                    onClick={() => {
                                        setSelectedServiceId(listing.id);
                                        setIsAvailabilityModalOpen(true);
                                    }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 py-5 rounded-xl font-bold text-sm"
                                >
                                    Set Availability
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Availability Management Modal (Overlay) */}
                {isAvailabilityModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Configure Availability</h3>
                                    <p className="text-xs text-gray-500 font-medium">{listings.find(l => l.id === selectedServiceId)?.title}</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Date</label>
                                    <input
                                        type="date"
                                        className="w-full h-14 px-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Time Slots</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {Array.isArray(availableSlots) && allPossibleSlots.map(slot => {
                                            const isSelected = availableSlots.includes(slot);
                                            return (
                                                <button
                                                    key={slot}
                                                    onClick={() => handleToggleSlot(slot)}
                                                    className={`py-3 px-1 rounded-xl border-2 transition-all text-xs font-bold flex flex-col items-center gap-1 ${isSelected
                                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                        : 'border-gray-100 bg-white text-gray-400'
                                                        }`}
                                                >
                                                    <span>{slot}</span>
                                                    {isSelected && <CheckCircle size={14} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 py-4 border-2 rounded-2xl font-bold"
                                        onClick={() => setIsAvailabilityModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-100"
                                        onClick={handleSaveAvailability}
                                        disabled={savingSlots}
                                    >
                                        {savingSlots ? "Saving..." : "Apply Availability"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderEarningsTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">$0.00</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">$0.00</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Completed Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">0</div>
                    </CardContent>
                </Card>
            </div>
            <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">Earnings history chart will be displayed here.</p>
            </div>
        </div>
    );

    const renderMarketplaceTab = () => (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900">Search Providers</h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Select
                            label=""
                            options={[{ value: '', label: 'Select Category' }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
                            value={searchFilters.categoryId}
                            onChange={(e) => setSearchFilters({ ...searchFilters, categoryId: e.target.value })}
                        />
                    </div>
                    <div className="flex-1">
                        <Input
                            placeholder="Location (Lat) - Demo: 40.7128"
                            value={searchFilters.lat}
                            onChange={(e) => setSearchFilters({ ...searchFilters, lat: e.target.value })}
                        />
                    </div>
                    <Button onClick={handleSearch}>
                        <Search size={18} className="mr-2" /> Search
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.length > 0 ? searchResults.map(res => (
                    <Card key={res.id}>
                        <CardContent className="p-4">
                            <h4 className="font-bold">{res.title}</h4>
                            <p className="text-sm text-gray-600">{res.description}</p>
                            <div className="mt-2 font-bold text-blue-600">${res.price}</div>
                        </CardContent>
                    </Card>
                )) : (
                    <p className="text-gray-500 col-span-full text-center">No results found or search not initiated.</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
                    <p className="text-gray-600">Manage your services and appointments</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                    {[
                        { id: 'services', label: 'My Services', icon: MapPin },
                        { id: 'appointments', label: 'My Appointments', icon: Calendar },
                        { id: 'availability', label: 'Availability', icon: Clock },
                        { id: 'earnings', label: 'Earnings', icon: DollarSign },
                        { id: 'marketplace', label: 'Marketplace', icon: Search },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'services' && renderServicesTab()}
                {activeTab === 'appointments' && renderAppointmentsTab()}
                {activeTab === 'availability' && renderAvailabilityTab()}
                {activeTab === 'earnings' && renderEarningsTab()}
                {activeTab === 'marketplace' && renderMarketplaceTab()}

            </main>
        </div>
    );
};

export default ProviderDashboard;
