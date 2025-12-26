import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = ({ showAuthButtons = true, onLogout }) => {
    const userRole = localStorage.getItem('userRole');
    const logoLink = userRole === 'PROVIDER' ? '/provider/dashboard' : (userRole === 'CUSTOMER' ? '/customer/dashboard' : '/');
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <div className="max-w-7xl mx-auto glass rounded-2xl px-6 shadow-2xl shadow-indigo-100/20">
                <div className="flex justify-between h-16 items-center">
                    <Link to={logoLink} className="flex items-center gap-3 group transition-transform hover:scale-105">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
                            <MapPin className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">Quick Serve</span>
                    </Link>

                    {userRole ? (
                        <div className="flex items-center gap-3">
                            <Link to={userRole === 'PROVIDER' ? '/provider/profile' : '/customer/profile'}>
                                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                                    <User size={18} />
                                    Profile
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    ) : (
                        showAuthButtons && (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm" className="px-5">Log In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button size="sm" className="px-6">Sign Up</Button>
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    showAuthButtons: PropTypes.bool,
    user: PropTypes.object,
    onLogout: PropTypes.func,
};
