import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateListing from './pages/CreateListings';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CustomerProfile from './pages/CustomerProfile';
import ProviderProfile from './pages/ProviderProfile';
import AdminProfile from './pages/AdminProfile';
import UpdateListing from './pages/UpdateListing';
import { Toaster } from 'sonner';

function App() {
    return (
        <>
        <Toaster
        position="bottom-right"
        richColors
        closeButton
        duration={5000} // Toast auto closes after 1 second
      />
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/provider/create-listing" element={<CreateListing />} />
                <Route path="/provider/update-listing/:id" element={<UpdateListing />} />
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                <Route path="/customer/search" element={<CustomerDashboard />} /> {/* Alias for search */}
                <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                <Route path="/customer/profile" element={<CustomerProfile />} />
                <Route path="/provider/profile" element={<ProviderProfile />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
        </>
        
    );
}

export default App;
