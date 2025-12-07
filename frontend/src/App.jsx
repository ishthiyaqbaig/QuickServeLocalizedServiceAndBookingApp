import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProfileSetup from './pages/ProfileSetup';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import CustomerProfile from './pages/CustomerProfile';
import ProviderProfile from './pages/ProviderProfile';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                <Route path="/customer/profile" element={<CustomerProfile />} />
                <Route path="/provider/profile" element={<ProviderProfile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
