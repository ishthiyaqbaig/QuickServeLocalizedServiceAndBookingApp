import { Link } from 'react-router-dom'
import { Search, MapPin, Star, ArrowRight, Wrench, Zap, Home, BookOpen, Truck, Scissors, Instagram, Linkedin, Twitter } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import banner from "../assets/hero-banner.png";
import appScreenshots from "../assets/img/app-screenshots.png";
import playStore from "../assets/img/google.png";
import appStore from "../assets/img/Apple.png";
import services from "../assets/home_services_illustration.png";
import { Navbar } from '../components/layout/Navbar';
import OfflineStruggleSection from '../components/layout/OfflineStruggleSection';
import SmartFeaturesSection from '../components/layout/SmartFeaturesSection';

const CATEGORIES = [
    { id: 'plumbing', label: 'Plumbing', icon: Wrench, color: 'bg-blue-100 text-blue-600' },
    { id: 'electrical', label: 'Electrical', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'cleaning', label: 'Cleaning', icon: Home, color: 'bg-green-100 text-green-600' },
    { id: 'tutoring', label: 'Tutoring', icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
    { id: 'moving', label: 'Moving', icon: Truck, color: 'bg-orange-100 text-orange-600' },
    { id: 'gardening', label: 'Gardening', icon: Scissors, color: 'bg-emerald-100 text-emerald-600' },
]

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={banner}
                        alt="Local Services"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Find the perfect professional for your needs
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                            Connect with trusted local experts for plumbing, cleaning, tutoring, and more.
                            Book instantly and get the job done right.
                        </p>

                        <div className="bg-white p-2 rounded-xl shadow-lg max-w-2xl flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="What service do you need?"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none"
                                />
                            </div>
                            <div className="flex-1 relative border-t sm:border-t-0 sm:border-l border-gray-200">
                                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Zip Code or City"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none"
                                />
                            </div>
                            <Button className="mt-1 py-5 px-8 text-lg">
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Popular Services</h2>
                        <p className="mt-4 text-gray-600">Explore our most requested service categories</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {CATEGORIES.map((category) => {
                            const Icon = category.icon
                            return (
                                <div
                                    key={category.id}
                                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group text-center"
                                >
                                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${category.color} group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="font-medium text-gray-900">{category.label}</h3>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            
            {/* Smart Features Section */}
            <SmartFeaturesSection/>

            {/* Download on Android/ios Section */}
            <div className='py-20'>
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div class="text-center">
                                <img
                                    src={appScreenshots}
                                    alt="App Screenshots"
                                    className="max-w-80% align-middle"
                                />
                            </div>
                        </div>
                        <div class="mb-6">
                            <h2 class="mb-12 mt-0 font-medium leading-snug text-[calc(1.325rem+.9vw)]">Find best offers in your area</h2>
                            <p class="text-gray-600 mb-6 mt-0">Manage your offers, customers, and success from your phone - anywhere, anytime. Designed to be simple, elegant, and powerful for todays multitasking platform.</p>
                            <p class="text-gray-600 mb-6 mt-0">Download on Android/ios.</p>
                            <div class="flex mb-6 image-shadow app-link">
                                <a href="#" target="_blank" class="mr-4">                                    
                                    <img
                                        src={playStore}
                                        alt="Play Store"
                                        className="w-[180px] align-middle object-contain"
                                    />
                                </a>
                                <a href="#" target="_blank" class="">                                    
                                    <img
                                        src={appStore}
                                        alt="App Store"
                                        className="w-[180px] align-middle object-contain"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*  */}
            <OfflineStruggleSection/>

            {/* Features / How it works */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why choose Quick Serve?</h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Star className="text-blue-600 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
                                        <p className="text-gray-600">Every service provider is vetted and reviewed to ensure high-quality service.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Zap className="text-blue-600 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
                                        <p className="text-gray-600">Book appointments instantly based on real-time availability.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Link to="/signup">
                                    <Button className="px-4 py-3">
                                        Get Started <ArrowRight size={16} />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                            <img
                                src={services}
                                alt="Local Services"
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <MapPin className="text-white w-5 h-5" />
                                </div>
                                <span className="text-xl font-bold text-white">Quick Serve</span>
                            </div>
                            <p className="text-sm">Connecting you with the best local professionals.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li>About Us</li>
                                <li>Careers</li>
                                <li>Press</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li>Help Center</li>
                                <li>Safety</li>
                                <li>Terms of Service</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    <Instagram className="w-5 h-5 text-white" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    <Twitter className="w-5 h-5 text-white" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    <Linkedin className="w-5 h-5 text-white" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
                        © 2025 QuickServe. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
