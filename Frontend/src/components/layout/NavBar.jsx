import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import {User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = ({ showAuthButtons = true, onLogout }) => {
    const userRole = localStorage.getItem('userRole');
    const logoLink = (userRole === 'PROVIDER' || userRole === 'SERVICE_PROVIDER') ? '/provider/dashboard' : (userRole === 'ADMIN' ? '/admin/dashboard' : (userRole === 'CUSTOMER' ? '/customer/search' : '/'));
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <div className="max-w-7xl mx-auto glass rounded-2xl shadow-2xl shadow-indigo-100/20 " >
                <div className="flex justify-between h-16 items-center bg-linear-to-r from-indigo-800 to-purple-300 rounded-2xl px-6">
                    <Link to={logoLink} className="flex items-center gap-3 group transition-transform hover:scale-105">
                        <img src="/quickserve-logo-transparent.png" alt="Quick Serve Logo" className="h-10 w-36 rounded-full" />
                    </Link>

                    {userRole ? (
                        <div className="flex items-center gap-3">
                            <Link to={(userRole === 'PROVIDER' || userRole === 'SERVICE_PROVIDER') ? '/provider/profile' : (userRole === 'ADMIN' ? '/admin/profile' : '/customer/profile')}>
                                <Button variant="ghost" size="sm" className="flex items-center gap-2">
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
                                    <Button variant="primary" size="sm" className="px-5 text-gray-100">Log In</Button>
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
