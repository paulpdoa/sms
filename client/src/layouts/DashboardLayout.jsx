import { useState, useContext, useEffect } from 'react';
import { Outlet,useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { MdOutlineMenu } from "react-icons/md";
import { MainContext } from '../helpers/MainContext';
import { useCookies } from 'react-cookie';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { isFreshYear,role,userToken,username } = useContext(MainContext);
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Add a loading state to prevent the effect from running before data is available
    const isLoading = role === undefined || username === undefined || userToken === undefined;

    useEffect(() => {
        if (!isLoading) {
            if (!role || !username) {
                removeCookie('userToken', { path: '/' });
                navigate('/login');  // Redirect to login if the user is not authorized
            }
        }
    }, [role, username, userToken, removeCookie, navigate, isLoading]);

    return (
        <main className="grid grid-cols-10 bg-gray-100 h-screen">
            {isFreshYear === null && isSidebarOpen && (
                <div className="col-span-2">
                    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                </div>
            )}
            <div className={`transition-all duration-300 ${(isFreshYear === null && isSidebarOpen) ? 'col-span-8' : 'col-span-10'} h-full bg-gray-100`}>
                <Navbar />
                {!isSidebarOpen && isFreshYear === null && (    
                    <button onClick={toggleSidebar} className="absolute top-6 left-4 text-gray-800">
                        <MdOutlineMenu size={24} />
                    </button>
                )}
                <Outlet />
            </div>
        </main>
    );
};

export default DashboardLayout;
