import { useFrappeAuth } from 'frappe-react-sdk';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState,useRef } from 'react';
import axios from 'axios';

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 

const notyf = new Notyf({
    duration: 3000,
    position: {
        x: 'right',
        y: 'top',
    },
    types: [
        {
            type: 'success',
            background: '#4caf50',
            icon: {
                className: 'notyf-icon notyf-icon--custom',
                tagName: 'i',
                text: '✓',
            },
        },
        {
            type: 'error',
            background: '#f44336',
            icon: {
                className: 'notyf-icon notyf-icon--custom',
                tagName: 'i',
                text: '✗',
            },
        },
    ],
});


const PrivateRoutes = () => {
    const { currentUser, isValidating, isLoading, logout } = useFrappeAuth();
    const location = useLocation();
    const path = location.pathname;

    const [roles, setRoles] = useState<string[]>([]);
    const [isCustomer, setIsCustomer] = useState<boolean>(false);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [unauthorizedRedirect, setUnauthorizedRedirect] = useState<string | null>(null);

    // Ref to track if notification was already shown
    const alertShown = useRef(false);

    useEffect(() => {
        axios
            .get('/api/method/reward_management.api.auth.get_user_roles')
            .then((res) => {
                const fetchedRoles = res.data.message.data.roles || [];
                setRoles(fetchedRoles);
                setIsCustomer(fetchedRoles.includes('Customer'));
                setLoadingRoles(false);
            })
            .catch((err) => {
                console.log("Failed to fetch roles", err);
                logout(); // fallback to logout on error
            });
    }, []);

    const isAdmin = roles.includes("Admin") || roles.includes("Administrator");

    const adminPaths = [
        '/admin-dashboard', '/admin-profile', '/product-master', '/gift-master',
        '/add-gift-product', '/edit-gift-product', '/add-product', '/edit-product',
        '/product-qr-history', '/download-qr-code', '/customer-product-orders',
        '/carpenter-registration', '/carpenter-details', '/redeemption-request',
        '/redeem-history', '/announcement', '/transaction-history', '/frequently-asked-question',
        '/company-address', '/add-login-instructions', '/product-catagory', '/add-user',
        '/set-reward-points', '/notifications', '/point-conversion', '/project'
    ];

    const customerPaths = [
        '/carpenter-dashboard', '/banking-history', '/point-history',
        '/qr-scanner', '/redeem-request', '/help-and-support', '/customer-announcement',
        '/profile-setting', '/gift-products', '/product-details', '/product-order',
        '/product-catalogue', '/catalogue-products', '/contact-us', '/point-details'
    ];

    if (!isLoading && !isValidating && (!currentUser || currentUser === 'Guest')) {
        return <Navigate to="/" state={{ from: location }} />;
    }

    if (loadingRoles) {
        return <div>Loading roles...</div>;
    }

    const isTryingAdminPath = adminPaths.some(route => path.startsWith(route));
    const isTryingCustomerPath = customerPaths.some(route => path.startsWith(route));

    // Access Validation
    if (isTryingAdminPath && !isAdmin) {
        if (!unauthorizedRedirect) {
            notyf.error("You are not authorized to access admin pages.");
            alertShown.current = true;
            setUnauthorizedRedirect('/admin-dashboard');
        }
        
    }

    if (isTryingCustomerPath && !isCustomer) {
        if (!unauthorizedRedirect) {
            notyf.error("You are not authorized to access customer pages.");
            alertShown.current = true;
            setUnauthorizedRedirect('/carpenter-dashboard');
        }
      
    }
     if (unauthorizedRedirect) {
        return <Navigate to={unauthorizedRedirect} replace />;
    }

    return <Outlet />;
};

export default PrivateRoutes;
