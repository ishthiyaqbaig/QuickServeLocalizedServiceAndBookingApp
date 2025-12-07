import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Filter, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MOCK_SERVICES } from '../data/mockData';
import { Navbar } from '../components/layout/Navbar';

const CustomerDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [services, setServices] = useState(MOCK_SERVICES);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        navigate('/');
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = MOCK_SERVICES.filter(service =>
            service.title.toLowerCase().includes(term) ||
            service.category.toLowerCase().includes(term) ||
            service.location.toLowerCase().includes(term)
        );
        setServices(filtered);
    };

    const user = {
        name: localStorage.getItem('userName') || 'Customer',
        role: localStorage.getItem('userRole') || 'CUSTOMER'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Available Services</h1>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Search services or location..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter size={20} />
                            Filter
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                                        {service.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star size={16} fill="currentColor" />
                                        <span className="text-sm font-medium text-gray-700">{service.rating}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                    <MapPin size={16} />
                                    {service.location}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500">Starting at</span>
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
