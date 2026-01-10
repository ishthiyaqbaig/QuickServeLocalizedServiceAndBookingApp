import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (Date.now() >= decoded.exp * 1000) {
                    localStorage.removeItem('authToken');
                    setUser(null);
                } else {
                    setUser({ token, role: decoded.role });
                }
            } catch {
                localStorage.removeItem('authToken');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('authToken', token);
        const decoded = jwtDecode(token);
        setUser({ token, role: decoded.role });
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        navigate('/login', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
