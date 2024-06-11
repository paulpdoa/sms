import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () =>{

    const viewHeight = window.outerHeight;

    return (
        <main style={{height:viewHeight}} className="grid grid-cols-10 bg-gray-100">
            <Sidebar />
            <div className="col-span-8 h-auto">
                <Navbar />
                <Outlet />
            </div>
        </main>
    )
}

export default DashboardLayout;