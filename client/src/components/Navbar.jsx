import { useLocation } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const pathName = location.pathname[1]?.toUpperCase() + location.pathname?.slice(2);

    const userLogout = () => {
        const message = 'Logout successful';
        localStorage.removeItem('userToken');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        toast.success(message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
        });
        setTimeout(() => {
            navigate('/login');
            window.location.reload()
        },2000)
    }

    return (
       <>
        <nav className="w-full bg-gray-200 p-4 flex items-center justify-between">
            {/* <h1 className="font-semibold text-lg">{ location.pathname === '/' ? 'Dashboard' : pathName }</h1> */}
            <h1 className="font-semibold text-lg">Name of School</h1>
            <div className="flex items-center gap-2">
                <FaRegUserCircle className="text-4xl" onClick={userLogout} />
            </div>
           
        </nav>
         <ToastContainer />
       </>
    )
}

export default Navbar;