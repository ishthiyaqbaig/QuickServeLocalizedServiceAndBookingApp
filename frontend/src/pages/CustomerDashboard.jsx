import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/layout/Navbar';

import { searchProviders } from '../services/customerService';
import { getCategories } from '../services/categoryService';
import { getBookingsByCustomer, customerCancelBooking } from '../services/bookingService';
import BookingModal from '../components/BookingModal';
import { Calendar, Search, MapPin, Clock } from 'lucide-react';

const CustomerDashboard = () => {
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [location, setLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('Fetching your location...');

    // Booking State
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);

    // Dashboard Tabs
    const [activeTab, setActiveTab] = useState('search');
    const [myBookings, setMyBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    // MOCK DATA
    const DUMMY_SERVICES = [
        {
            id: 1,
            title: "Deep House Cleaning",
            description: "Professional deep cleaning for your home.",
            price: 1500,
            categoryId: 1,
            images: "https://images.unsplash.com/photo-1581578731117-104f2a41d95e?auto=format&fit=crop&q=80&w=1000",
            distance: 2.5,
            providerId: 101 // Mock provider
        },
        {
            id: 2,
            title: "Plumbing Repair",
            description: "Fixing leaks, clogs, and pipe issues.",
            price: 500,
            categoryId: 2,
            images: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=1000",
            distance: 0.8,
            providerId: 102
        }
    ];

    // DEBUG: Logs to verify file update and mounting
    useEffect(() => {
        console.log("CustomerDashboard Mounted. Active Tab:", activeTab);
    }, [activeTab]);

    // 🔹 LOGOUT HANDLER
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // 🔹 GET USER LOCATION
    const getLocation = () => {
        setLocationStatus("Fetching location...");

        if (!navigator.geolocation) {
            setLocationStatus("Geolocation not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                setLocation({ lat, lng });
                setLocationStatus("Location detected!");
            },
            (err) => {
                console.error(err);
                setLocationStatus("Location access denied.");
            }
        );
    };

    // 🔹 SEARCH NEARBY PROVIDERS
    const handleSearch = async () => {
        if (!location) {
            alert("Please enable location first.");
            return;
        }
        if (!selectedCategory) {
            alert("Please select a category.");
            return;
        }

        setLoading(true);
        try {
            const data = await searchProviders(location.lat, location.lng, selectedCategory);
            setServices(data);
        } catch (err) {
            console.error(err);
            console.warn("API failed, using dummy data");
            setServices(DUMMY_SERVICES); // Fallback to dummy
            // alert("Search failed"); // Don't alert for demo
        } finally {
            setLoading(false);
        }
    };

    // ⭐ Fetch categories + user location on mount
    useEffect(() => {
        // fetch categories
        getCategories()
            .then(data => {
                setCategories(data);
            })
            .catch(err => console.error("Failed to fetch categories", err));

        // get location automatically
        getLocation();
    }, []);

    const user = {
        name: localStorage.getItem("userName") || "Customer",
        role: "CUSTOMER",
        id: localStorage.getItem("userId")
    };

    // 🔹 FETCH MY BOOKINGS
    useEffect(() => {
        if (activeTab === 'bookings' && user.id) {
            setLoadingBookings(true);
            getBookingsByCustomer(user.id)
                .then(data => setMyBookings(data || []))
                .catch(err => console.error("Failed to load bookings", err))
                .finally(() => setLoadingBookings(false));
        }
    }, [activeTab, user.id]);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await customerCancelBooking(bookingId);
                setMyBookings(myBookings.map(b =>
                    b.id === bookingId ? { ...b, status: 'Cancelled' } : b
                ));
            } catch (err) {
                alert("Failed to cancel booking. Only pending bookings can be cancelled by customers.");
            }
        }
    };

    const handleOpenBooking = (service) => {
        setSelectedServiceForBooking(service);
        setBookingModalOpen(true);
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : `Category ${id}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} onLogout={handleLogout} />

            <main className="max-w-6xl mx-auto px-4 py-8">

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Dashboard</h1>

                {/* TABS & SEARCH BAR CONTAINER */}
                <div className="relative z-20">
                    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-10 border border-gray-100">
                        {/* TABS */}
                        <div className="flex gap-4 mb-6 p-1 bg-gray-50 rounded-xl w-fit">
                            <button
                                onClick={() => setActiveTab('search')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'search' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Search size={16} /> Find Services
                            </button>
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'bookings' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Calendar size={16} /> My Bookings
                            </button>
                        </div>

                        {/* SEARCH BAR */}
                        {activeTab === 'search' && (
                            <div className="flex flex-col md:flex-row items-stretch gap-4">
                                {/* CATEGORY */}
                                <div className="flex-[2] relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                        <Search size={20} />
                                    </div>
                                    <select
                                        className="w-full pl-12 pr-4 h-14 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none text-gray-700 font-medium"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="" disabled>Select a category...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* LOCATION STATUS */}
                                <div className="flex-1 flex items-center gap-3 px-4 h-14 bg-gray-50 border border-gray-200 rounded-xl text-gray-600">
                                    <MapPin size={20} className={location ? "text-green-500" : "text-gray-400"} />
                                    <span className="text-sm font-medium truncate">
                                        {locationStatus}
                                    </span>
                                </div>

                                {/* SEARCH BUTTON */}
                                <Button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="h-14 px-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            <span>Searching...</span>
                                        </div>
                                    ) : (
                                        "Search Near Me"
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* SEARCH TAB CONTENT - RESULTS ONLY */}
                {activeTab === 'search' && (
                    <>
                        {/* RESULTS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {services.length === 0 && !loading && (
                                <div className="col-span-full text-center text-gray-400 py-10">
                                    No services found. Try selecting a different category.
                                </div>
                            )}

                            {services.map(service => (
                                <div
                                    key={service.id}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
                                >
                                    {/* IMAGE */}
                                    <div className="h-48 bg-gray-200">
                                        <img
                                            src={service.images}
                                            alt={service.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="p-6">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                                            {getCategoryName(service.categoryId)}
                                        </span>

                                        <h3 className="text-xl font-bold mt-3">{service.title}</h3>

                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                            {service.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                            <MapPin size={16} />
                                            {service.distance
                                                ? `${service.distance.toFixed(1)} km away`
                                                : "Nearby"}
                                        </div>

                                        <div className="flex justify-between items-center border-t pt-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Price</p>
                                                <p className="text-lg font-bold text-blue-600">₹{service.price}</p>
                                            </div>

                                            <Button onClick={() => handleOpenBooking(service)}>Book Now</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* BOOKINGS TAB CONTENT */}
                {activeTab === 'bookings' && (
                    <div className="space-y-6">
                        {loadingBookings ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
                                <p>Loading your bookings...</p>
                            </div>
                        ) : myBookings.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900">No upcoming bookings</h3>
                                <p className="text-gray-500 max-w-xs mx-auto mt-2">
                                    When you book a service, it will appear here for you to track.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {myBookings.map(booking => (
                                    <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
                                        <div className="flex gap-4 items-center">
                                            <div className={`p-3 rounded-xl ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600' :
                                                booking.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' :
                                                    booking.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-gray-50 text-gray-600'
                                                }`}>
                                                {booking.status === 'CONFIRMED' ? <CheckCircle size={24} /> :
                                                    booking.status === 'PENDING' ? <Clock size={24} /> :
                                                        <Calendar size={24} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{booking.serviceName || 'Service Name'}</h3>
                                                <div className="text-sm text-gray-600 font-medium">
                                                    Provider: {booking.providerName || 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1 font-medium">
                                                    <Calendar size={14} /> {booking.bookingDate} at {booking.timeSlot}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                    <MapPin size={12} /> {booking.providerAddress || 'Provider Location'}
                                                </div>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                            booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                                'bg-gray-100 text-gray-700 border border-gray-200'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                    {booking.status === 'PENDING' && <span className="text-[10px] text-gray-400 italic font-medium">Awaiting Provider Response</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 font-semibold mb-1">TOTAL PRICE</p>
                                                <p className="font-extrabold text-blue-600 text-2xl">₹{booking.price?booking.price:10000}</p>
                                            </div>
                                            {booking.status === 'PENDING' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:bg-red-50 border-red-100"
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                >
                                                    Cancel Request
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* BOOKING MODAL */}
                <BookingModal
                    isOpen={bookingModalOpen}
                    onClose={() => setBookingModalOpen(false)}
                    service={selectedServiceForBooking}
                    userId={user.id}
                />
            </main>
        </div>
    );
};

export default CustomerDashboard;
