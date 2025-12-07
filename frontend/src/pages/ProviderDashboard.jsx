import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MOCK_USERS, MOCK_APPOINTMENTS } from '../data/mockData';
import { Navbar } from '../components/layout/Navbar';

const ProviderDashboard = () => {
    const provider = MOCK_USERS.provider;
    const appointments = MOCK_APPOINTMENTS.filter(app => app.providerId === provider.id);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        navigate('/');
    };

    const user = {
        name: localStorage.getItem('userName') || 'Provider',
        role: localStorage.getItem('userRole') || 'PROVIDER'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {provider.name}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                                    <span className="text-gray-600">Total Earnings</span>
                                    <span className="text-2xl font-bold text-blue-600">$1,240</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                    <span className="text-gray-600">Completed Jobs</span>
                                    <span className="text-2xl font-bold text-green-600">12</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                                    <span className="text-gray-600">Rating</span>
                                    <span className="text-2xl font-bold text-yellow-600">{provider.rating}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Appointments Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
                        {appointments.length > 0 ? (
                            appointments.map((apt) => (
                                <Card key={apt.id}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between md:justify-start gap-4">
                                                    <h3 className="text-lg font-bold text-gray-900">{apt.serviceTitle}</h3>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {apt.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User size={16} />
                                                    <span>Customer: {apt.customerName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MapPin size={16} />
                                                    <span>{apt.location}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={16} />
                                                        {apt.date}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={16} />
                                                        {apt.time}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-row md:flex-col justify-between items-end gap-4">
                                                <span className="text-xl font-bold text-blue-600">${apt.price}</span>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-200">
                                                        Decline
                                                    </Button>
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                        Accept
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                                <p className="text-gray-500">No upcoming appointments</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProviderDashboard;
