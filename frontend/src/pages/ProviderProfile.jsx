import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Star, ArrowLeft, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MOCK_USERS, MOCK_SERVICES } from '../data/mockData';

const ProviderProfile = () => {
    const user = MOCK_USERS.provider;
    const services = MOCK_SERVICES.filter(s => s.providerId === user.id);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/provider/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                            <ArrowLeft size={20} />
                            <span>Back to Dashboard</span>
                        </Link>
                        <span className="text-xl font-bold text-gray-900">My Profile</span>
                        <div className="w-24"></div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Profile Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Professional Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                                        <div className="flex items-center gap-2 text-gray-900">
                                            <User size={18} className="text-gray-400" />
                                            {user.name}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Service Category</label>
                                        <div className="flex items-center gap-2 text-gray-900">
                                            <Briefcase size={18} className="text-gray-400" />
                                            {user.serviceCategory}
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
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Bio</label>
                                    <p className="text-gray-700">{user.bio}</p>
                                </div>

                                <div className="flex items-center gap-6 pt-4 border-t">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{user.rating}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <Star size={14} className="text-yellow-500 fill-current" />
                                            Rating
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{user.reviews}</div>
                                        <div className="text-sm text-gray-500">Reviews</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button variant="outline">Edit Profile</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Services Offered */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>My Services</CardTitle>
                        <Button size="sm">Add New Service</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {services.map((service) => (
                                <div key={service.id} className="border rounded-lg p-4 flex gap-4">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-900">{service.title}</h4>
                                            <span className="font-bold text-blue-600">${service.price}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.description}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="text-yellow-500 fill-current" />
                                                {service.rating}
                                            </div>
                                            <div>{service.location}</div>
                                        </div>
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

export default ProviderProfile;
