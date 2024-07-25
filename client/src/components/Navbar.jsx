import { useLocation } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { useCookies } from 'react-cookie';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathName = 'Christian School International';

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

    const userLogout = () => {
        setIsLoggingOut(true);
        const message = 'Logout successful';

        // Clear user data from localStorage
        ['userToken', 'username', 'role', 'id', 'session', 'user', 'isFreshYear'].forEach(item => localStorage.removeItem(item));

        toast.success(message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });

        setTimeout(() => {
            // Remove userToken cookie
            removeCookie('userToken',{ path: '/login' });
            navigate('/login');
        }, 2000);
    };

    return (
        <>
            <nav className="w-full bg-gradient-to-r border-b border-gray-300 from-gray-100 to-gray-200 p-4 flex items-center justify-between shadow-md">
                <h1 className="font-semibold flex items-center gap-2 text-xl text-gray-700 ml-6">
                    <img className="w-10" src="/schoolLogo/CAPSCI-Logo.png" alt={pathName} />
                    {pathName}
                </h1>
                <div className="relative">
                    <HiChevronDown
                        className="text-3xl text-gray-700 cursor-pointer transition-transform transform hover:scale-110"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />  
                    {showDropdown && (
                        <div className="absolute top-12 right-0 mt-2 w-40 bg-white shadow-md text-center p-2 z-10">
                            <button
                                onClick={userLogout}
                                className="text-sm text-gray-700 hover:bg-gray-100 w-full py-2 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
            <ToastContainer />
        </>
    );
};

export default Navbar;
