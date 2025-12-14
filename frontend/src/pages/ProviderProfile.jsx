import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Navbar } from '../components/layout/Navbar';

const ProviderProfile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Initial state from localStorage or defaults
    const [profile, setProfile] = useState({
        name: localStorage.getItem('userName') || 'Provider',
        email: localStorage.getItem('userEmail') || 'provider@example.com',
        mobile: localStorage.getItem('userMobile') || '',
        bio: localStorage.getItem('userBio') || '',
        location: localStorage.getItem('userLocation') || '',
        profileImage: localStorage.getItem('userProfileImage') || null
    });

    const user = {
        name: profile.name,
        role: 'SERVICE_PROVIDER'
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create local preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({
                    ...prev,
                    profileImage: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setLoading(true);
        // Simulator API call / Persistence to LocalStorage
        setTimeout(() => {
            localStorage.setItem('userName', profile.name);
            localStorage.setItem('userEmail', profile.email);
            localStorage.setItem('userMobile', profile.mobile);
            localStorage.setItem('userBio', profile.bio);
            localStorage.setItem('userLocation', profile.location);
            if (profile.profileImage) {
                localStorage.setItem('userProfileImage', profile.profileImage);
            }

            setLoading(false);
            setIsEditing(false);
            alert("Profile updated successfully!");
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => navigate('/provider/dashboard')}>
                    <ArrowLeft size={18} /> Back to Dashboard
                </Button>

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={loading}>
                        {loading ? 'Saving...' : (isEditing ? <><Save size={18} className="mr-2" /> Save Changes</> : 'Edit Profile')}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Image & Bio */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto border-4 border-white shadow-lg">
                                        {profile.profileImage ? (
                                            <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                <User size={48} />
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-sm transition">
                                            <Camera size={16} />
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    )}
                                </div>
                                <h2 className="mt-4 text-xl font-bold text-gray-900">{profile.name}</h2>
                                <p className="text-sm text-blue-600 font-medium bg-blue-50 inline-block px-3 py-1 rounded-full mt-2">Service Provider</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">About Me</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Tell customers about your experience..."
                                    />
                                ) : (
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {profile.bio || "No bio added yet."}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                                        {isEditing ? (
                                            <Input name="name" value={profile.name} onChange={handleInputChange} />
                                        ) : (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-900">
                                                <User size={18} className="text-gray-400" /> {profile.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                                        {isEditing ? (
                                            <Input name="email" value={profile.email} onChange={handleInputChange} />
                                        ) : (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-900">
                                                <Mail size={18} className="text-gray-400" /> {profile.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-500">Mobile Number</label>
                                        {isEditing ? (
                                            <Input name="mobile" value={profile.mobile} onChange={handleInputChange} placeholder="+1 234 567 890" />
                                        ) : (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-900">
                                                <Phone size={18} className="text-gray-400" /> {profile.mobile || "Not set"}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-500">Location / Address</label>
                                        {isEditing ? (
                                            <Input name="location" value={profile.location} onChange={handleInputChange} placeholder="City, Country" />
                                        ) : (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-900">
                                                <MapPin size={18} className="text-gray-400" /> {profile.location || "Not set"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderProfile;
