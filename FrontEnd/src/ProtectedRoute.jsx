import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ children, adminRoute = false }) => {
    const { authToken } = useAuth();    

    if (!authToken) {
        return <Navigate to="/" replace />;
    }

    const decoded = jwtDecode(authToken);
    const isAdmin = decoded.roles.includes('ROLE_ADMIN');

    if (adminRoute && !isAdmin) {
        return <Navigate to="/homePageCustomer" replace />;
    } else if (!adminRoute && isAdmin) {
        return <Navigate to="/homePageAdmin" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
