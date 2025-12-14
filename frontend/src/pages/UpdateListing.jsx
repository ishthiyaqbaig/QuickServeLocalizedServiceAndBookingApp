import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Navbar } from '../components/layout/Navbar'
import { Select } from '../components/ui/Select'
import { getCategories } from '../services/categoryService'
import { getListingById, updateListing } from '../services/providerService'

export default function UpdateListing() {
    const navigate = useNavigate()
    const { id } = useParams() // listingId
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [file, setFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        categoryId: '',
    })

    /* ---------------- FETCH DATA ---------------- */

    useEffect(() => {
        fetchCategories()
        fetchListing()
    }, [])

    const fetchCategories = async () => {
        try {
            const data = await getCategories()
            setCategories(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to load categories', error)
        }
    }

    const fetchListing = async () => {
        try {
            const listing = await getListingById(id)
            console.log("Fetched listing:", listing);
            setFormData({
                title: listing.title,
                description: listing.description,
                price: listing.price,
                categoryId: listing.category?.id || '',
            })

            // Existing image preview
            if (listing.images) {
                setImagePreview(listing.images)
            }
        } catch (error) {
            console.error('Failed to load listing', error)
            alert('Listing not found')
            navigate('/provider/dashboard')
        }
    }

    /* ---------------- HANDLERS ---------------- */

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
            setImagePreview(URL.createObjectURL(selectedFile))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const form = new FormData()
            form.append('title', formData.title)
            form.append('description', formData.description)
            form.append('price', formData.price)

            if (formData.categoryId) {
                form.append('categoryId', formData.categoryId)
            }

            if (file) {
                form.append('image', file)
            }

            await updateListing(id, form)

            alert('Listing updated successfully!')
            navigate('/provider/dashboard')
        } catch (error) {
            console.error('Update failed:', error)
            alert(error.response?.data?.message || 'Failed to update listing')
        } finally {
            setLoading(false)
        }
    }

    const user = {
        name: localStorage.getItem('userName') || 'Provider',
        role: 'PROVIDER',
    }

    /* ---------------- UI ---------------- */

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <div className="py-12 px-4">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold text-center mb-6">
                        Update Service Listing
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Image Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full h-48 bg-gray-100 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden relative">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
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
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            required
                        />

                        {/* Category */}
                        <Select
                            label="Category"
                            options={categories.map((c) => ({
                                value: c.id,
                                label: c.name,
                            }))}
                            value={formData.categoryId}
                            onChange={(e) =>
                                setFormData({ ...formData, categoryId: e.target.value })
                            }
                        />

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                rows={4}
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        {/* Price */}
                        <Input
                            label="Price (₹)"
                            type="number"
                            value={formData.price}
                            onChange={(e) =>
                                setFormData({ ...formData, price: e.target.value })
                            }
                            required
                        />

                        <Button type="submit" className="w-full py-3" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Listing'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
