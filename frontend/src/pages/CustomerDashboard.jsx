import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/layout/NavBar';
import { searchProviders } from '../services/customerService';
import { getCategories } from '../services/categoryService';
import { getBookingsByCustomer, customerCancelBooking } from '../services/bookingService';
import BookingModal from '../components/BookingModal';
import { Calendar, Search, MapPin, Clock, ArrowRight, Star, CheckCircle, Bell } from 'lucide-react';
import NotificationsTab from '../components/NotificationsTab';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [location, setLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('Fetching location...');
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
    const [activeTab, setActiveTab] = useState('search');
    const [myBookings, setMyBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const getLocation = () => {
        setLocationStatus("Fetching location...");
        if (!navigator.geolocation) {
            setLocationStatus("Not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLocationStatus("Located");
            },
            () => setLocationStatus("Access denied")
        );
    };

    const handleSearch = async () => {
        if (!location) { alert("Enable location first"); return; }
        if (!selectedCategory) { alert("Select a category"); return; }
        setLoading(true);
        try {
            const data = await searchProviders(location.lat, location.lng, selectedCategory);
            setServices(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories().then(setCategories).catch(console.error);
        getLocation();
    }, []);

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName") || "Customer";

    useEffect(() => {
        if (activeTab === 'bookings' && userId) {
            setLoadingBookings(true);
            getBookingsByCustomer(userId)
                .then(data => setMyBookings(data || []))
                .catch(console.error)
                .finally(() => setLoadingBookings(false));
        }
    }, [activeTab, userId]);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Cancel this booking?")) {
            try {
                await customerCancelBooking(bookingId);
                setMyBookings(myBookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
            } catch (err) {
                alert("Only PENDING bookings can be cancelled.");
            }
        }
    };

    const getCategoryName = (id) => categories.find(c => c.id === id)?.name || `Category ${id}`;

    return (
        <div className="min-h-screen">
            <Navbar showAuthButtons={false} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 py-32">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Hello, <span className="text-gradient">{userName}</span>
                    </h1>
                    <p className="text-gray-500 text-lg">Find the best local experts or manage your bookings.</p>
                </div>

                {/* TABS CONTROLLER */}
                <div className="flex gap-2 p-1.5 glass rounded-2xl w-fit mb-12 shadow-inner">
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'search' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:text-indigo-600 hover:bg-white/50'}`}
                    >
                        <Search size={18} /> Find Services
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'bookings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:text-indigo-600 hover:bg-white/50'}`}
                    >
                        <Calendar size={18} /> My Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:text-indigo-600 hover:bg-white/50'}`}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                </div>

                {activeTab === 'search' && (
                    <div className="space-y-12">
                        {/* SEARCH PANEL */}
                        <div className="glass p-4 rounded-3xl shadow-2xl flex flex-col lg:flex-row gap-4">
                            <div className="flex-[2] relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <select
                                    className="w-full pl-12 pr-4 h-16 bg-white/40 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all appearance-none text-gray-700 font-bold text-lg cursor-pointer"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="" disabled>What service are you looking for?</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="flex-1 flex items-center gap-3 px-6 h-16 bg-white/40 rounded-2xl border-none">
                                <MapPin size={22} className={location ? "text-indigo-600" : "text-gray-400"} />
                                <span className="text-gray-600 font-bold">{locationStatus}</span>
                            </div>
                            <Button size="lg" onClick={handleSearch} disabled={loading} className="h-16 px-12 rounded-2xl text-xl">
                                {loading ? "Searching..." : "Search"}
                            </Button>
                        </div>

                        {/* SEARCH RESULTS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.length === 0 && !loading && (
                                <div className="col-span-full py-20 glass rounded-[2.5rem] text-center border-dashed">
                                    <Search size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-400 font-bold text-xl">Search results will appear here</p>
                                </div>
                            )}
                            {services.map(service => (
                                <div key={service.id} className="glass group overflow-hidden rounded-[2rem] transition-all duration-500 hover:scale-[1.02]">
                                    <div className="h-56 overflow-hidden relative">
                                        <img src={service.images} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                                                {getCategoryName(service.categoryId)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-2xl font-black text-gray-900 mb-3">{service.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{service.description}</p>
                                        <div className="flex items-center gap-2 text-indigo-600/70 text-xs font-black uppercase tracking-tighter mb-6 bg-indigo-50/50 w-fit px-3 py-1.5 rounded-lg border border-indigo-100">
                                            <MapPin size={14} /> {service.distance ? `${service.distance.toFixed(1)} km away` : "Nearby"}
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-50/50 p-5 rounded-2xl border border-white/40 shadow-inner">
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Starting Price</p>
                                                <p className="text-2xl font-black text-indigo-600 tracking-tight">₹{service.price}</p>
                                            </div>
                                            <Button onClick={() => { setSelectedServiceForBooking(service); setBookingModalOpen(true); }} className="shadow- indigo-200">Book Now</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="space-y-8">
                        {loadingBookings ? (
                            <div className="flex flex-col items-center justify-center py-32 glass rounded-[2.5rem]">
                                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-6" />
                                <p className="font-bold text-gray-400">Loading bookings...</p>
                            </div>
                        ) : myBookings.length === 0 ? (
                            <div className="text-center py-32 glass rounded-[3rem] border-dashed">
                                <Calendar size={64} className="mx-auto text-gray-200 mb-6" />
                                <h3 className="text-2xl font-black text-gray-900">No active bookings</h3>
                                <p className="text-gray-500 mt-2 font-medium">Your scheduled services will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {myBookings.map(booking => (
                                    <div key={booking.id} className="glass p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-2xl transition-all duration-500 border-white/60">
                                        <div className="flex gap-6 items-center">
                                            <div className={`p-5 rounded-2xl shadow-lg ${booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100' : booking.status === 'PENDING' ? 'bg-amber-50 text-amber-600 shadow-amber-100' : booking.status === 'COMPLETED' ? 'bg-indigo-50 text-indigo-600 shadow-indigo-100' : 'bg-gray-100 text-gray-400'}`}>
                                                {booking.status === 'CONFIRMED' ? <CheckCircle size={32} /> : booking.status === 'PENDING' ? <Clock size={32} /> : <Calendar size={32} />}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-gray-900 text-xl mb-1">{booking.serviceName}</h3>
                                                <p className="text-indigo-600 font-bold text-sm mb-3">with {booking.providerName}</p>
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                        <Calendar size={14} className="text-indigo-400" /> {booking.bookingDate}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                        <Clock size={14} className="text-indigo-400" /> {booking.timeSlot}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-4 w-full md:w-auto mt-4 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-white/40">
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-black tracking-widest mb-1">BOOKING AMOUNT</p>
                                                <p className="font-black text-indigo-600 text-3xl tracking-tighter">₹{booking.price || 0}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-4 py-1.5 text-[10px] rounded-full font-black uppercase tracking-widest border ${booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                    {booking.status}
                                                </span>
                                                {booking.status === 'PENDING' && <Button variant="outline" size="sm" onClick={() => handleCancelBooking(booking.id)} className="text-rose-600 border-rose-100 bg-rose-50/30 hover:bg-rose-50 text-xs font-black px-4 h-9">Cancel</Button>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <NotificationsTab userId={userId} />
                )}

                <BookingModal
                    isOpen={bookingModalOpen}
                    onClose={() => setBookingModalOpen(false)}
                    service={selectedServiceForBooking}
                    userId={userId}
                />
            </main>
        </div>
    );
};

export default CustomerDashboard;
