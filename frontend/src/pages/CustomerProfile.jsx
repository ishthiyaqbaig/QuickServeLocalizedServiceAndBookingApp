import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MOCK_USERS, MOCK_APPOINTMENTS } from '../data/mockData';

const CustomerProfile = () => {
    const user = MOCK_USERS.customer;
    const appointments = MOCK_APPOINTMENTS.filter(app => app.customerId === user.id);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/customer/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                            <ArrowLeft size={20} />
                            <span>Back to Dashboard</span>
                        </Link>
                        <span className="text-xl font-bold text-gray-900">My Profile</span>
                        <div className="w-24"></div> {/* Spacer for centering */}
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Profile Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <User size={18} className="text-gray-400" />
                                        {user.name}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Mail size={18} className="text-gray-400" />
                                        {user.email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Phone size={18} className="text-gray-400" />
                                        {user.phone}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Address</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <MapPin size={18} className="text-gray-400" />
                                        {user.address}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button variant="outline">Edit Profile</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Appointments */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {appointments.map((apt) => (
                                <div key={apt.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{apt.serviceTitle}</h4>
                                        <p className="text-sm text-gray-600">Provider: {apt.providerName}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
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
                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {apt.status}
                                        </span>
                                        <span className="font-bold text-gray-900">${apt.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default CustomerProfile;
