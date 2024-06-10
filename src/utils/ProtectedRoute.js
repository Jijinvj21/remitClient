import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.login.token);
    let location = useLocation();
    console.log(user);

    // Assuming user is an object and you want to check if user is authenticated
    if (!user) {
        return <Navigate to="/sign-up" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
