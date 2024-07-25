import { useState, useContext } from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { MdOutlineMenu } from "react-icons/md";
import { MainContext } from '../helpers/MainContext';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { isFreshYear } = useContext(MainContext);
    console.log(isFreshYear);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
                    <button onClick={toggleSidebar} className="absolute top-4 left-4 text-gray-800">
                        <MdOutlineMenu size={24} />
                    </button>
                )}
                <Outlet />
            </div>
        </main>
    );
};

export default DashboardLayout;
