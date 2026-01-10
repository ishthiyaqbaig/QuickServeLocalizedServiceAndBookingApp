import { Link } from 'react-router-dom'
import { MapPin, Star, ArrowRight, Wrench, Zap, Home, BookOpen, Truck, Scissors, Instagram, Linkedin, Twitter } from 'lucide-react'
import { Button } from '../components/ui/Button'
import banner from "../assets/hero-banner.png";
import appScreenshots from "../assets/img/app-screenshots.png";
import playStore from "../assets/img/google.png";
import appStore from "../assets/img/Apple.png";
import services from "../assets/home_services_illustration.png";
import OfflineStruggleSection from '../components/layout/OfflineStruggleSection';
import SmartFeaturesSection from '../components/layout/SmartFeaturesSection';
import { Navbar } from '../components/layout/Navbar';

const CATEGORIES = [
    { id: 'plumbing', label: 'Plumbing', icon: Wrench, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'electrical', label: 'Electrical', icon: Zap, color: 'bg-amber-100 text-amber-600' },
    { id: 'cleaning', label: 'Cleaning', icon: Home, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'tutoring', label: 'Tutoring', icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
    { id: 'moving', label: 'Moving', icon: Truck, color: 'bg-orange-100 text-orange-600' },
    { id: 'gardening', label: 'Gardening', icon: Scissors, color: 'bg-rose-100 text-rose-600' },
]

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-40">
                <div className="absolute inset-0 -z-10">
                    <img
                        src={banner}
                        alt="Background"
                        className="w-full h-full object-cover opacity-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                            Find the <span className="text-gradient">Perfect Expert</span> <br />
                            for Every Task
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
                            Connecting you with trusted local professionals for everything from home repairs to tutoring.
                            Simple, fast, and secure.
                        </p>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-bold mb-4">Popular <span className="text-gradient">Categories</span></h2>
                            <p className="text-lg text-gray-600">Explore our most requested services and book your expert today.</p>
                        </div>
                        <Button variant="ghost" className="hidden md:flex">
                            View all categories <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {CATEGORIES.map((category) => {
                            const Icon = category.icon
                            return (
                                <div
                                    key={category.id}
                                    className="glass p-8 rounded-2xl hover:bg-white transition-all duration-500 cursor-pointer group text-center hover:scale-105"
                                >
                                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 ${category.color} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-wider text-sm">{category.label}</h3>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <SmartFeaturesSection />

            {/* Download Section */}
            <div className='py-32 overflow-hidden'>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass p-12 md:p-20 rounded-[3rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

                        <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                            <div className="order-2 md:order-1">
                                <div className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-6">MOBILE APP</div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Find Best Offers <br /><span className="text-gradient">On The Go</span></h2>
                                <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                                    Manage your bookings, chat with professionals, and get real-time updates directly from your phone.
                                    Available now for iOS and Android.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <a href="#" className="hover:scale-105 transition-transform duration-300">
                                        <img src={playStore} alt="Play Store" className="h-14" />
                                    </a>
                                    <a href="#" className="hover:scale-105 transition-transform duration-300">
                                        <img src={appStore} alt="App Store" className="h-14" />
                                    </a>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl scale-110 -z-10" />
                                    <img src={appScreenshots} alt="App Screenshots" className="max-w-md w-full drop-shadow-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <OfflineStruggleSection />

            {/* Features */}
            <div className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass rounded-[3rem] overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            <div className="p-12 md:p-20">
                                <h2 className="text-4xl font-bold mb-10 leading-tight">Why Choose <br /><span className="text-gradient">Quick Serve?</span></h2>
                                <div className="space-y-12">
                                    <div className="flex gap-6 group">
                                        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-colors duration-500 group-hover:scale-110">
                                            <Star className="text-indigo-600 group-hover:text-white transition-colors w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">Verified Professionals</h3>
                                            <p className="text-lg text-gray-600">Every service provider is vetted and reviewed for your peace of mind.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 group">
                                        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-colors duration-500 group-hover:scale-110">
                                            <Zap className="text-indigo-600 group-hover:text-white transition-colors w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">Instant Booking</h3>
                                            <p className="text-lg text-gray-600">Book appointments in seconds based on real-time availability.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-16">
                                    <Link to="/signup">
                                        <Button size="lg" className="px-10">
                                            Get Started Now <ArrowRight size={20} className="ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="bg-indigo-600/10 p-12 flex items-center justify-center">
                                <img
                                    src={services}
                                    alt="Services"
                                    className="w-full max-w-lg drop-shadow-2xl rounded-3xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer-glass py-24 mb-12 mx-4 border-t border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <MapPin className="text-white w-6 h-6" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900 tracking-tight">Quick Serve</span>
                            </div>
                            <p className="text-gray-500 leading-relaxed mb-8">
                                The most trusted platform for finding local experts and getting things done efficiently.
                            </p>
                            <div className="flex gap-4">
                                {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                                    <a key={i} href="#" className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-8 uppercase tracking-widest text-xs">Platform</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Find Services</li>
                                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Become a Provider</li>
                                <li className="hover:text-indigo-600 transition-colors cursor-pointer">How it Works</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-8 uppercase tracking-widest text-xs">Support</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Help Center</li>
                                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Safety Guidelines</li>
                                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Terms & Privacy</li>
                            </ul>
                        </div>
                        <div className="glass p-8 rounded-3xl">
                            <h4 className="font-bold text-gray-900 mb-4">Join Newsletter</h4>
                            <p className="text-sm text-gray-500 mb-6">Get weekly updates on the best local services.</p>
                            <div className="flex flex-col gap-3">
                                <input type="email" placeholder="Email address" className="bg-white/50 border border-white/60 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                                <Button className="w-full">Subscribe</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
