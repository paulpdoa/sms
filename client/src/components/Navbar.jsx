import { useLocation } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState,useContext } from 'react';
import { useCookies } from 'react-cookie';
import { CiLogout } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { MainContext } from "../helpers/MainContext";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathName = 'School Management System';

    const { role } = useContext(MainContext);

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

    const userLogout = () => {
        setIsLoggingOut(true);
        const message = 'Logout successful';

       
        toast.success(message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: () => {
                // Remove userToken cookie
                removeCookie('userToken', { path: '/' });
                ['userToken', 'username', 'role', 'id', 'session', 'user', 'isFreshYear'].forEach(item => localStorage.removeItem(item));
                navigate('/login');
            }
        });
    };

    return (
        <>
            <nav className="w-full bg-gradient-to-r border-b border-gray-300 from-gray-100 to-gray-200 p-3 flex items-center justify-between shadow-md">
                <h1 className="font-semibold flex items-center gap-2 text-xl text-gray-700 ml-6">
                    <img className="w-10" src="/schoolLogo/school-logo-filler.png" alt={pathName} />
                    {pathName}
                </h1>
                <div className="relative">
                    <HiChevronDown
                        className="text-3xl text-gray-700 cursor-pointer transition-transform transform hover:scale-110"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />  
                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div
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
            <ToastContainer />
        </>
    );
};

export default Navbar;
