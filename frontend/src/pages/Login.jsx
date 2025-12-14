import  { useState } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Navbar } from '../components/layout/Navbar'
import { Select } from '../components/ui/Select'
import { login } from '../services/authService'

export default function Login() {
    const navigate = useNavigate()
    const [role, setRole] = useState('CUSTOMER')
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({})
    const [apiError, setApiError] = useState('')

    const validateForm = () => {
        const newErrors = {}

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required'
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

        const loginData = {
            ...formData,
            role
        }

        login(loginData)
            .then((data) => {
                console.log('Login successful:', data)
                if (data.token) {
                     localStorage.setItem('authToken', data.token)

                    // ✅ Decode token to get ID & role
                    const decoded = jwtDecode(data.token)

                    const userId = decoded.userId
                    const userRole = decoded.role

                    localStorage.setItem('userId', userId)
                    localStorage.setItem('userRole', userRole)
                }
                localStorage.setItem('userRole', role)

                if (role === 'PROVIDER') {
                    navigate('/provider/dashboard')
                } else {
                    navigate('/customer/search')
                }
            })
            .catch((error) => {
                console.error('Login failed:', error)
                setApiError(error.response?.data?.message || 'Login failed. Please check your credentials.')
            })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar showAuthButtons={false} />
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="mt-2 text-gray-600">Sign in to your account</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                        {apiError && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
                                {apiError}
                            </div>
                        )}
                        <div className="space-y-4">
                            <Select
                                label="I am a"
                                options={[
                                    { value: 'CUSTOMER', label: 'Customer' },
                                    { value: 'PROVIDER', label: 'Service Provider' }
                                ]}
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
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
                            <Input
                                label="Password"
                                type="password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                error={errors.password}
                            />
                        </div>




                        <Button type="submit" className="w-full py-3 text-lg rounded-lg">
                            Sign In
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" type="button" className="py-3 text-lg">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline" type="button" className="w-full">
                                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </Button>
                        </div>

                        <div className="text-center text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
