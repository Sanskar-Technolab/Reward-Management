import { useFrappeAuth } from 'frappe-react-sdk';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoutes = () => {

    // ? LOGIN HOOK
    const {
        currentUser,
        isValidating,
        isLoading,
        login,
        logout,
        error,
        updateCurrentUser,
        getUserCookie,
    } = useFrappeAuth();

    // ? LOCATION HOOK 
    const location = useLocation();

    // return !isLoading && !isValidating && (currentUser ? element : <Navigate to="/auth/login" state={{ from: location }} />);
    if (!isLoading && !isValidating && (!currentUser || currentUser === 'Guest')) {
        return <Navigate to="/" />
    }
    return (
        <Outlet />
    )
}

export default PrivateRoutes