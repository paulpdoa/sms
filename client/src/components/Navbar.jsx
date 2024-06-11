import { useLocation } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";

const Navbar = () => {

    const location = useLocation();
    const pathName = location.pathname[1]?.toUpperCase() + location.pathname?.slice(2);

    return (
        <nav className="w-full bg-gray-200 p-4 flex items-center justify-between">
            {/* <h1 className="font-semibold text-lg">{ location.pathname === '/' ? 'Dashboard' : pathName }</h1> */}
            <h1 className="font-semibold text-lg">Name of School</h1>
            <div className="flex items-center gap-2">
                <FaRegUserCircle className="text-4xl" />
            </div>
        </nav>
    )
}

export default Navbar;