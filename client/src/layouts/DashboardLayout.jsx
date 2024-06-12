import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () =>{

    return (
        <main className="grid grid-cols-10 bg-gray-100 h-screen">
            <Sidebar />
            <div className="col-span-8 h-full bg-gray-100">
                <Navbar />
                <Outlet />
            </div>
        </main>
    )
}

export default DashboardLayout;