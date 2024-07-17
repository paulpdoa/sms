import { useLocation } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { useCookies } from 'react-cookie';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathName = 'School Name';

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']); // Importing removeCookie

    const userLogout = () => {
        setIsLoggingOut(true);
        const message = 'Logout successful';

        // Clear user data from localStorage
        ['userToken', 'username', 'role', 'id', 'session', 'user'].forEach(item => localStorage.removeItem(item));

        // Remove userToken cookie
        removeCookie('userToken', { path: '/' });

        toast.success(message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
        });

        setTimeout(() => {
            navigate('/login');
            window.location.reload();
        }, 2000);
    };

    return (
        <>
            <nav className="w-full bg-gradient-to-r from-green-500 to-green-600 p-3 flex items-center justify-between shadow-lg">
                <h1 className="font-semibold text-lg text-white ml-9">{ pathName }</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <FaRegUserCircle 
                            className="text-4xl text-white cursor-pointer transition-transform transform hover:scale-110" 
                            onClick={userLogout} 
                        />
                        {isLoggingOut && (
                            <div className="absolute top-10 right-0 mt-2 w-32 bg-white rounded-lg shadow-md text-center p-2">
                                <span className="text-sm text-gray-700">Logging out...</span>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <ToastContainer />
        </>
    );
};

export default Navbar;
