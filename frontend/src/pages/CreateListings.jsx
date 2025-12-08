import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, MapPin } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Navbar } from '../components/layout/Navbar'
import { Select } from '../components/ui/Select'
import { createListing } from '../services/providerService'

const CATEGORIES = [
    { id: 1, label: 'Plumbing' },
    { id: 2, label: 'Electrical' },
    { id: 3, label: 'Cleaning' },
    { id: 4, label: 'Tutoring' },
    { id: 5, label: 'Moving' },
    { id: 6, label: 'Gardening' },
]

export default function CreateListing() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [file, setFile] = useState(null)
    const [locationStatus, setLocationStatus] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        categoryId: '1',
        permanentLatitude: '',
        permanentLongitude: '',
        permanentAddress: ''
    })

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
            setImagePreview(URL.createObjectURL(selectedFile))
        }
    }

    const getLocation = () => {
        setLocationStatus('Fetching location...')
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        permanentLatitude: position.coords.latitude,
                        permanentLongitude: position.coords.longitude
                    }))
                    setLocationStatus('Location fetched! (Lat: ' + position.coords.latitude.toFixed(4) + ')')
                },
                (error) => {
                    console.error("Error fetching location", error)
                    setLocationStatus('Error fetching location. Please enter manually if needed, though coordinate search wont work well.')
                }
            )
        } else {
            setLocationStatus('Geolocation is not supported by this browser.')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const providerId = localStorage.getItem('userId')
            if (!providerId) {
                alert('User ID not found. Please login again.')
                navigate('/login')
                return
            }

            const data = new FormData()
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('price', formData.price)
            data.append('categoryId', formData.categoryId)
            data.append('permanentLatitude', formData.permanentLatitude)
            data.append('permanentLongitude', formData.permanentLongitude)
            data.append('permanentAddress', formData.permanentAddress)

            if (file) {
                data.append('image', file)
            }

            await createListing(providerId, data)
            alert('Listing created successfully!')
            // navigate('/provider/dashboard') // or wherever
        } catch (error) {
            console.error('Failed to create listing', error)
            alert('Failed to create listing')
        } finally {
            setLoading(false)
        }
    }

    const user = {
        name: localStorage.getItem('userName') || 'Provider',
        role: 'PROVIDER'
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Create Service Listing</h2>
                        <p className="mt-2 text-gray-600">Set up your service to start getting orders</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Image Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden relative group">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <Upload className="mx-auto h-10 w-10 mb-2" />
                                        <p>Click to upload service image</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        <Input
                            label="Service Title"
                            placeholder="e.g. Professional Home Cleaning"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />

                        <Select
                            label="Category"
                            options={CATEGORIES.map(c => ({ value: c.id, label: c.label }))}
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Describe your service..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Input
                                label="Price ($)"
                                type="number"
                                placeholder="50"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={getLocation} className="flex items-center gap-2">
                                    <MapPin size={18} />
                                    Get Current Location
                                </Button>
                                <span className="text-sm text-gray-500 self-center">{locationStatus}</span>
                            </div>
                            {(formData.permanentLatitude && formData.permanentLongitude) && (
                                <p className="text-xs text-green-600">
                                    Coordinates: {formData.permanentLatitude}, {formData.permanentLongitude}
                                </p>
                            )}
                            <Input
                                placeholder="Manual Address (Optional)"
                                value={formData.permanentAddress}
                                onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="w-full py-3" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Listing'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
