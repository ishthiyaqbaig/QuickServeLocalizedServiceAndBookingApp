import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = ({ showAuthButtons = true, onLogout }) => {
    const user=localStorage.getItem('userRole')
    const logoLink = user
        ? (user.role === 'PROVIDER' ? '/provider/dashboard' : '/customer/dashboard')
        : '/';
        const navigate = useNavigate();
        const logout = () => {
  localStorage.clear();
  navigate('/');
}
    return (
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to={logoLink} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <MapPin className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Quick Serve</span>
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to={user === 'PROVIDER' ? '/provider/profile' : '/customer/profile'}>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <User size={20} />
                                    Profile
                                </Button>
                            </Link>
                            <Button variant="outline" onClick={logout}>Logout</Button>
                        </div>
                    ) : (
                        showAuthButtons && (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <Button variant="primary" className="px-5 py-2">Log In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="py-2 px-4">Sign Up</Button>
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
