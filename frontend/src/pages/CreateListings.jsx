import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, MapPin } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Navbar } from '../components/layout/Navbar'
import { Select } from '../components/ui/Select'
import { createListing } from '../services/providerService'
import { getCategories } from '../services/categoryService'

export default function CreateListing() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [file, setFile] = useState(null)
    const [locationStatus, setLocationStatus] = useState('')
    const [categories, setCategories] = useState([])

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        categoryId: '',
        permanentLatitude: '',
        permanentLongitude: '',
        permanentAddress: '',
    })

    // Fetch categories on load
    useEffect(() => {
        getCategories()
            .then((data) => {
                setCategories(data)

                // set first category by default
                if (data.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        categoryId: data[0].id,
                    }))
                }
            })
            .catch((err) => console.error('Failed to load categories', err))
    }, [])

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
                    setFormData((prev) => ({
                        ...prev,
                        permanentLatitude: position.coords.latitude,
                        permanentLongitude: position.coords.longitude,
                    }))
                    setLocationStatus('Location fetched successfully!')
                },
                (error) => {
                    console.error('Error fetching location', error)
                    setLocationStatus('Unable to fetch location.')
                }
            )
        } else {
            setLocationStatus('Geolocation not supported in browser.')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const providerId = localStorage.getItem('userId')

            if (!providerId) {
                alert('User ID missing. Login again.')
                navigate('/login')
                return
            }

            const form = new FormData()
            form.append('title', formData.title)
            form.append('description', formData.description)
            form.append('price', formData.price)
            form.append('categoryId', formData.categoryId)
            form.append('permanentLatitude', formData.permanentLatitude)
            form.append('permanentLongitude', formData.permanentLongitude)
            form.append('permanentAddress', formData.permanentAddress)

            if (file) form.append('image', file)

            await createListing(providerId, form)

            alert('Listing created successfully!')
            navigate('/provider/dashboard')
        } catch (error) {
            console.error('Failed to create listing:', error)
            alert('Failed to create listing')
        } finally {
            setLoading(false)
        }
    }

    const user = {
        name: localStorage.getItem('userName') || 'Provider',
        role: 'PROVIDER',
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <div className="py-12 px-4">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">

                    <h2 className="text-3xl font-bold text-center mb-6">Create Service Listing</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Image Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden relative">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-500 text-center">
                                        <Upload className="mx-auto h-10 w-10 mb-2" />
                                        <p>Upload service image</p>
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

                        {/* Title */}
                        <Input
                            label="Service Title"
                            placeholder="e.g. AC Repair"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />

                        {/* Category (DYNAMIC) */}
                        <Select
                            label="Category"
                            options={categories.map((c) => ({
                                value: c.id,
                                label: c.name,
                            }))}
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        />

                        {/* Description */}
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

                        {/* Price */}
                        <Input
                            label="Price (₹)"
                            type="number"
                            placeholder="500"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />

                        {/* LOCATION */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Location</label>

                            <div className="flex gap-2 items-center">
                                <Button type="button" onClick={getLocation} variant="outline" className="flex items-center gap-2">
                                    <MapPin size={18} />
                                    Get Current Location
                                </Button>
                                <span className="text-sm text-gray-500">{locationStatus}</span>
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

                        {/* Submit */}
                        <Button type="submit" className="w-full py-3" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Listing'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
