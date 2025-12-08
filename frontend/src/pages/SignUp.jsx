import React, { useState } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from 'react-router-dom'
import { User, Briefcase, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Navbar } from '../components/layout/Navbar'

import { register } from '../services/authService'

export default function SignUp() {
    const navigate = useNavigate()
    const [role, setRole] = useState('CUSTOMER') // 'CUSTOMER' | 'PROVIDER'
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [errors, setErrors] = useState({})
    const [apiError, setApiError] = useState('')

    const validateForm = () => {
        const newErrors = {}

        // Name validation
        if (!formData.userName.trim()) {
            newErrors.userName = 'Username is required'
        } else if (formData.userName.length < 2) {
            newErrors.userName = 'Username must be at least 2 characters'
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must be 8+ chars, with 1 uppercase, 1 number, 1 special char'
        }

        // Confirm Password validation
        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setApiError('')

        if (!validateForm()) {
            return
        }

        const userData = {
            ...formData,
            role
        }

        register(userData)
            .then((data) => {
               console.log('Registration successful:', data)

    if (data.token) {
        localStorage.setItem('authToken', data.token)

        // ✅ Decode token to get ID & role
        const decoded = jwtDecode(data.token)

        const userId = decoded.userId
        const userRole = decoded.role

        localStorage.setItem('userId', userId)
        localStorage.setItem('userRole', userRole)
    }

    localStorage.setItem('userName', formData.userName)

    if (role === 'SERVICE_PROVIDER') {
        navigate('/provider/create-listing')
    } else {
        navigate('/customer/search')
    }
            })
            .catch((error) => {
                console.error('Registration failed:', error)
                setApiError(error.response?.data?.message || 'Registration failed. Please try again.')
            })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar showAuthButtons={false} />
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
                        <p className="mt-2 text-gray-600">Join our community today</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                        {apiError && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
                                {apiError}
                            </div>
                        )}
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => setRole('CUSTOMER')}
                                className={`cursor-pointer p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${role === 'CUSTOMER'
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-blue-200'
                                    }`}
                            >
                                <User size={32} />
                                <span className="font-semibold">Customer</span>
                                {role === 'CUSTOMER' && <CheckCircle2 size={20} className="text-blue-600" />}
                            </div>

                            <div
                                onClick={() => setRole('SERVICE_PROVIDER')}
                                className={`cursor-pointer p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${role === 'PROVIDER'
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-blue-200'
                                    }`}
                            >
                                <Briefcase size={32} />
                                <span className="font-semibold">Provider</span>
                                {role === 'SERVICE_PROVIDER' && <CheckCircle2 size={20} className="text-blue-600" />}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Username"
                                type="text"
                                required
                                placeholder="Rahul"
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                error={errors.userName}
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                required
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={errors.email}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    error={errors.password}
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    error={errors.confirmPassword}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                            </p>
                        </div>

                        <Button type="submit" className="w-full py-3 text-lg">
                            Sign Up as {role === 'CUSTOMER' ? 'Customer' : 'Service Provider'}
                        </Button>

                        <div className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
