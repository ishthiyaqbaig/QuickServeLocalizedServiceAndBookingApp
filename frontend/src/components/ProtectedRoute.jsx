import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Role check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // or a "Not Authorized" page
    }

    return <Outlet />;
};

export default ProtectedRoute;
