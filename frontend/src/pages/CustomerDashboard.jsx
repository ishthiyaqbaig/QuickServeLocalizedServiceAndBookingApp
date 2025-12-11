import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Navbar } from '../components/layout/Navbar';

import { searchProviders } from '../services/customerService';
import { getCategories } from '../services/categoryService';

const CustomerDashboard = () => {
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [location, setLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('Fetching your location...');

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
            alert("Search failed");
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
        role: "CUSTOMER"
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : `Category ${id}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} onLogout={handleLogout} />

            <main className="max-w-6xl mx-auto px-4 py-8">

                <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Services Nearby</h1>

                {/* SEARCH BAR */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-10 flex flex-col md:flex-row gap-6">
                    {/* CATEGORY */}
                    <div className="flex-1">
                        <Select
                            label="Select Category"
                            options={categories.map(c => ({
                                value: c.id,
                                label: c.name
                            }))}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        />
                    </div>

                    {/* LOCATION STATUS */}
                    <div className="self-center text-gray-600 text-sm">
                        {locationStatus}
                    </div>

                    {/* SEARCH BUTTON */}
                    <Button
                        onClick={handleSearch}
                        disabled={loading}
                        className="h-11 px-6"
                    >
                        {loading ? "Searching..." : "Search Near Me"}
                    </Button>
                </div>

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
