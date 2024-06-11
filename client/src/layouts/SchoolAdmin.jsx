import { Outlet } from "react-router-dom";
import DateTime from '../components/DateTime';

const SchoolAdmin = () => {
    return (
        <main className="p-2">
            <DateTime />
            <div className="flex items-center justify-center">
               <Outlet />
            </div>
        </main>
    )  
}

export default SchoolAdmin;