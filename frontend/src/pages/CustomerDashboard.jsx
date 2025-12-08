import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Navbar } from '../components/layout/Navbar';
import { searchProviders } from '../services/providerService';

const CATEGORIES = [
    { id: 1, label: 'Plumbing' },
    { id: 2, label: 'Electrical' },
    { id: 3, label: 'Cleaning' },
    { id: 4, label: 'Tutoring' },
    { id: 5, label: 'Moving' },
    { id: 6, label: 'Gardening' },
]

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [services, setServices] = useState([]); // Empty initially
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [locationStatus, setLocationStatus] = useState('Please enable location to search');

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        navigate('/');
    };

    const getLocation = () => {
        setLocationStatus('Fetching location...')
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocationStatus('Location found! Ready to search.');
                },
                (error) => {
                    console.error("Error fetching location", error)
                    setLocationStatus('Location access denied. Cannot search nearby providers.')
                }
            )
        } else {
            setLocationStatus('Geolocation not supported.')
        }
    }

    const handleSearch = async () => {
        if (!location) {
            alert('Please enable location logic first (Click Get Location or wait for auto-detect)');
            return;
        }
        if (!selectedCategory) {
            alert('Please select a category');
            return;
        }

        setLoading(true);
        try {
            const data = await searchProviders(location.lat, location.lng, selectedCategory);
            // Verify data format. Guide says List<Listing>.
            // Listing has providerId, categoryId, title, description, price, images, permanentAddress
            setServices(data || []);
        } catch (error) {
            console.error('Search failed', error);
            alert('Search failed');
        } finally {
            setLoading(false);
        }
    };

    // Auto-get location on mount
    useEffect(() => {
        getLocation();
    }, []);

    const user = {
        name: localStorage.getItem('userName') || 'Customer',
        role: localStorage.getItem('userRole') || 'CUSTOMER'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Find Services Nearby</h1>
                </div>

                {/* Search Bar Block */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <Select
                            label="Category"
                            options={CATEGORIES.map(c => ({ value: c.id, label: c.label }))}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-auto pb-1 text-sm text-gray-500">
                        {locationStatus}
                    </div>

                    <Button onClick={handleSearch} disabled={loading || !location} className="w-full md:w-auto h-11 mb-[1px]">
                        {loading ? 'Searching...' : 'Search Near Me'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.length === 0 && !loading && (
                        <div className="col-span-full text-center text-gray-500 py-12">
                            No services found. Try a different category or change location.
                        </div>
                    )}

                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden bg-gray-200">
                                {service.images ? (
                                    <img
                                        src={service.images}
                                        alt={service.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                                        Category {service.categoryId}
                                        {/* Ideally map ID back to Label if possible */}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                    <MapPin size={16} />
                                    Distance: {service.distance ? service.distance.toFixed(1) + ' km' : 'Nearby'}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500">Price</span>
                                        <span className="text-lg font-bold text-blue-600">${service.price}</span>
                                    </div>
                                    <Button>Book Now</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboard;
