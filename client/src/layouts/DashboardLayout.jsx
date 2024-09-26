import { useState, useContext, useEffect } from 'react';
import { Outlet,useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { MdOutlineMenu } from "react-icons/md";
import { MainContext } from '../helpers/MainContext';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { isFreshYear,role,userToken,username, session } = useContext(MainContext);
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Add a loading state to prevent the effect from running before data is available
    const isLoading = role === undefined || username === undefined || userToken === undefined;

    useEffect(() => {
        if (!isLoading) {
            if (!role || !username) {
                enqueueSnackbar('Sorry, you are not allowed to view this page, please login again', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    },
                    autoHideDuration: 3000,
                    preventDuplicate: true,
                    onClose: () => {
                        removeCookie('userToken', { path: '/' });
                        removeCookie('userToken', { path: '/master' });
                        removeCookie('userToken', { path: '/finance' });
                        removeCookie('userToken', { path: '/guest' });
                        removeCookie('userToken', { path: '/registrar' });
                        removeCookie('userToken', { path: '/student' });
                        removeCookie('userToken', { path: '/teacher' });
                        ['id', 'currentUserId', 'session', 'role', 'username'].forEach(lclstg => localStorage.removeItem(lclstg));
                        navigate('/login');
                    }
                });
            }
        }
    }, [role, username, userToken, removeCookie, navigate, isLoading,session]);

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
