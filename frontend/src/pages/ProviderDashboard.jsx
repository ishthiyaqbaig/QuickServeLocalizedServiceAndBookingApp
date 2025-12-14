import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, DollarSign, Plus, Trash2, Edit, Search, Filter, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Navbar } from '../components/layout/Navbar';
import { Select } from '../components/ui/Select';
import { getProviderListings, deleteListing } from '../services/providerService';
import { searchProviders } from '../services/customerService';
import { getCategories } from '../services/categoryService';

const ProviderDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('services');
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        if (activeTab === 'services' && user.id) {
            setLoading(true);
            getProviderListings(user.id)
                .then(data => {
                    setListings(Array.isArray(data) ? data : []);
                    const fetchedListings = Array.isArray(data) ? data : [];
                    // DUMMY LISTING FOR TEST PURPOSES
                    // const dummyListing = {
                    //     id: 999,
                    //     title: 'Sample: Deep Home Cleaning',
                    //     price: 120,
                    //     description: 'This is a test listing to demonstrate the UI layout. It helps verify how services appear.',
                    //     images: 'https://images.unsplash.com/photo-1581578731117-104f2a41d95e?w=500&auto=format&fit=crop&q=60'
                    // };
                    // setListings([...fetchedListings, dummyListing]);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch listings", err);
                    setError("Could not load listings.");
                   // On error, still show dummy listing
                    // const dummyListing = {
                    //     id: 999,
                    //     title: 'Sample: Deep Home Cleaning',
                    //     price: 120,
                    //     description: 'This is a test listing (fallback).',
                    //     images: 'https://images.unsplash.com/photo-1581578731117-104f2a41d95e?w=500&auto=format&fit=crop&q=60'
                    // };
                    // setListings([dummyListing]);
                    // setError(null); // Suppress error for demo
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
        <div className="text-center py-16 bg-white rounded-xl border border-dashed">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Appointments Yet</h3>
            <p className="text-gray-500">Your upcoming appointments will appear here.</p>
        </div>
    );

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
                {activeTab === 'earnings' && renderEarningsTab()}
                {activeTab === 'marketplace' && renderMarketplaceTab()}

            </main>
        </div>
    );
};

export default ProviderDashboard;
