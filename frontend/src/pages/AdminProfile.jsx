import React from 'react';
import { Navbar } from '../components/layout/NavBar';
import { User, Mail, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminProfile() {
    const email = localStorage.getItem('userEmail') || 'd@gmail.com'; // Fallback for now if not stored
    const role = localStorage.getItem('userRole');
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-6 mt-16">
                <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-xl p-10 relative overflow-hidden">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="absolute top-8 left-8 p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-indigo-600"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" />

                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
                            <Shield className="text-white w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Admin Profile</h1>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Email Address</p>
                                <p className="text-lg font-bold text-gray-900">{email}</p>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Role</p>
                                <p className="text-lg font-bold text-gray-900">{role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
