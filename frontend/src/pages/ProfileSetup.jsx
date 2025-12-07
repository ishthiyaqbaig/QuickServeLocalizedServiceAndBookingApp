import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wrench, Zap, Home, BookOpen, Truck, Scissors, Check, Upload, MapPin, DollarSign } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Navbar } from '../components/layout/Navbar'

const CATEGORIES = [
    { id: 'plumbing', label: 'Plumbing', icon: Wrench },
    { id: 'electrical', label: 'Electrical', icon: Zap },
    { id: 'cleaning', label: 'Cleaning', icon: Home },
    { id: 'tutoring', label: 'Tutoring', icon: BookOpen },
    { id: 'moving', label: 'Moving', icon: Truck },
    { id: 'gardening', label: 'Gardening', icon: Scissors },
]

export default function ProfileSetup() {
    const navigate = useNavigate()
    const [selectedServices, setSelectedServices] = useState([]) // Array of { id, price }
    const [bio, setBio] = useState('')
    const [experience, setExperience] = useState('')
    const [location, setLocation] = useState({ address: '', city: '', state: '', pincode: '' })
    const [profileImage, setProfileImage] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [apiError, setApiError] = useState('')

    const user = {
        name: localStorage.getItem('userName') || 'Provider',
        role: 'PROVIDER'
    }

    const toggleCategory = (id) => {
        if (selectedServices.find(s => s.id === id)) {
            setSelectedServices(selectedServices.filter(s => s.id !== id))
        } else {
            setSelectedServices([...selectedServices, { id, price: '' }])
        }
    }

    const updateServicePrice = (id, price) => {
        setSelectedServices(selectedServices.map(s =>
            s.id === id ? { ...s, price } : s
        ))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setProfileImage(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setApiError('')

        const profileData = {
            services: selectedServices,
            bio,
            experience,
            location,
            profileImage: previewUrl // In a real app, this would be a file upload to S3/Cloudinary first
        }

        updateProfile(profileData)
            .then(() => {
                console.log('Profile setup successful')
                localStorage.setItem('providerProfile', JSON.stringify(profileData))
                navigate('/provider/dashboard')
            })
            .catch((error) => {
                console.error('Profile setup failed:', error)
                setApiError(error.response?.data?.message || 'Failed to save profile. Please try again.')
            })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
                        <p className="mt-2 text-gray-600">Tell customers about your services and expertise</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {apiError && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
                                {apiError}
                            </div>
                        )}
                        {/* Profile Image */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="text-gray-400 w-8 h-8" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <span className="text-sm text-gray-500">Upload Profile Picture</span>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Years of Experience"
                                type="number"
                                min="0"
                                placeholder="e.g. 5"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                required
                            />
                            <div className="space-y-4">
                                <Input
                                    label="Full Address"
                                    placeholder="123 Main St, Apt 4B"
                                    value={location.address}
                                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                                    required
                                />
                                <div className="grid grid-cols-3 gap-4">
                                    <Input
                                        label="City"
                                        placeholder="New York"
                                        value={location.city}
                                        onChange={(e) => setLocation({ ...location, city: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="State"
                                        placeholder="NY"
                                        value={location.state}
                                        onChange={(e) => setLocation({ ...location, state: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Pincode"
                                        placeholder="10001"
                                        value={location.pincode}
                                        onChange={(e) => setLocation({ ...location, pincode: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio / Description
                            </label>
                            <textarea
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Tell us about your experience, skills, and what makes you the best choice..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                required
                            />
                        </div>

                        {/* Services & Pricing */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Select Services & Set Pricing
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {CATEGORIES.map((category) => {
                                    const Icon = category.icon
                                    const service = selectedServices.find(s => s.id === category.id)
                                    const isSelected = !!service

                                    return (
                                        <div
                                            key={category.id}
                                            className={`p-4 border-2 rounded-xl transition-all ${isSelected
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-200'
                                                }`}
                                        >
                                            <div
                                                className="flex items-center gap-3 cursor-pointer mb-3"
                                                onClick={() => toggleCategory(category.id)}
                                            >
                                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                                                    {category.label}
                                                </span>
                                                {isSelected && <Check size={16} className="ml-auto text-blue-600" />}
                                            </div>

                                            {isSelected && (
                                                <div className="pl-12 mt-2">
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                                        <input
                                                            type="number"
                                                            placeholder="Price"
                                                            className="w-full pl-9 pr-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={service.price}
                                                            onChange={(e) => updateServicePrice(category.id, e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            required={isSelected}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-3 text-lg"
                            disabled={selectedServices.length === 0}
                        >
                            Complete Setup
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
