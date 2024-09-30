import { useLocation } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { CiLogout } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { MainContext } from "../helpers/MainContext";
import { useSnackbar } from 'notistack';
import Searchbar from "./Searchbar";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathName = 'Welcome to School Management System';

    const { setSearchQuery } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
    const dropdownRef = useRef(null); // Reference to the dropdown

    const userLogout = () => {
        setIsLoggingOut(true);
        const message = "Logout successful";

        enqueueSnackbar(message, { 
            variant: 'success',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            autoHideDuration: 2000,
            preventDuplicate: true,
            onClose: () => {
                // Remove userToken cookie
                removeCookie('userToken', { path: '/' });
                removeCookie('userToken', { path: '/master' });
                removeCookie('userToken', { path: '/finance' });
                removeCookie('userToken', { path: '/guest' });
                removeCookie('userToken', { path: '/registrar' });
                removeCookie('userToken', { path: '/student' });
                removeCookie('userToken', { path: '/teacher' });
                ['userToken', 'username', 'role', 'id', 'session', 'user', 'isFreshYear'].forEach(item => localStorage.removeItem(item));
                navigate('/login');
            }
        });
    };

    // Close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <>
            <nav className="w-full bg-gradient-to-r border-b border-gray-300 from-gray-100 to-gray-200 p-3 flex items-center justify-between shadow-md">
                <div className="flex gap-5 items-center">
                    <h1 className="font-semibold flex items-center gap-2 text-lg text-gray-700 ml-6">
                        <img className="w-10" src="/schoolLogo/school-logo-filler.png" alt={pathName} />
                        {pathName}
                    </h1>
                    <Searchbar onSearch={setSearchQuery} />
                </div>
                <div className="relative">
                    <HiChevronDown
                        className="text-3xl text-gray-700 cursor-pointer transition-transform transform hover:scale-110"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />
                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div
                                ref={dropdownRef} // Attach ref to the dropdown
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-12 right-0 mt-2 w-40 bg-white shadow-md rounded-md text-center p-2 z-10"
                            >
                                <div className="absolute top-0 right-4 w-4 h-4 bg-white rotate-45 transform -translate-y-2"></div>
                                <button
                                    onClick={userLogout}
                                    className="text-sm text-gray-700 hover:bg-gray-100 w-full py-2 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <CiLogout className="text-gray-700 font-bold text-xl" /> Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
