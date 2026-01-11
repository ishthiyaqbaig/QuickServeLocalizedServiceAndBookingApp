import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import {User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useState } from 'react';

export const Navbar = ({ showAuthButtons = true, onLogout }) => {
    const userRole = localStorage.getItem('userRole');
    const logoLink = (userRole === 'PROVIDER' || userRole === 'SERVICE_PROVIDER') ? '/provider/dashboard' : (userRole === 'ADMIN' ? '/admin/dashboard' : (userRole === 'CUSTOMER' ? '/customer/search' : '/'));
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const logout = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <div className="max-w-7xl mx-auto glass rounded-2xl shadow-2xl shadow-indigo-100/20 " >
                <div className="flex gap-2 justify-between h-16 items-center bg-linear-to-r from-indigo-800 to-purple-300 rounded-2xl px-6">
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
                            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    ) : (
                        showAuthButtons && (
                            <div className="flex items-center gap-1">
                                <Link to="/login">
                                    <Button variant="primary" size="sm" className="md:px-5 text-gray-100 text-nowrap">Log In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button size="sm" className="md:px-6 text-nowrap">Sign Up</Button>
                                </Link>
                            </div>
                        )
                    )}
                 
                </div>
            </div>
               {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          
          {/* 3. Modal Box */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You will need to enter your password again to access your account.
            </p>

            {/* 4. Action Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }
                }
                className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition"
              >
                Yes, Log Me Out
              </button>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 active:scale-95 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        </nav>
    );
};

Navbar.propTypes = {
    showAuthButtons: PropTypes.bool,
    user: PropTypes.object,
    onLogout: PropTypes.func,
};
