import { useNavigate, Link } from 'react-router-dom'
import { User, Briefcase, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useState } from 'react'

export default function SignUp() {
    const navigate = useNavigate()
    const [role, setRole] = useState('CUSTOMER') // 'CUSTOMER' | 'PROVIDER'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        // Mock registration logic
        console.log('Registering as:', role, formData)

        // Store role in local storage for demo purposes
        localStorage.setItem('userRole', role)
        localStorage.setItem('userName', formData.name)

        if (role === 'PROVIDER') {
            navigate('/profile-setup')
        } else {
            navigate('/')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
                    <p className="mt-2 text-gray-600">Join our community today</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                            onClick={() => setRole('PROVIDER')}
                            className={`cursor-pointer p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${role === 'PROVIDER'
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-blue-200'
                                }`}
                        >
                            <Briefcase size={32} />
                            <span className="font-semibold">Provider</span>
                            {role === 'PROVIDER' && <CheckCircle2 size={20} className="text-blue-600" />}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <Input
                            label="Password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
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
    )
}
