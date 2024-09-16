import { Outlet,useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { MainContext } from '../helpers/MainContext';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ParentLayout = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

    const { role,username } = useContext(MainContext);
    const navigate = useNavigate();

    const isLoading = role === undefined
    useEffect(() => {
        if(!isLoading) {
            if(role !== 'Parent') {
                setTimeout(() => {
                    removeCookie('userToken', { path: '/parent' });
                    ['id', 'currentUserId', 'session', 'role', 'username'].forEach(lclstg => localStorage.removeItem(lclstg));
                    navigate('/login');
                }, 3000); // Delay by 3 seconds to match the toast's autoClose time
                toast.error('Sorry, you are not allowed to view this page, please login again', {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
               });
            }
        }
    },[role,removeCookie,navigate]); 

    return (
        <>
            {/* Render the ToastContainer here */}
            <ToastContainer />
            {/* Render the Outlet to display child routes */}
            <Outlet />
        </>
    )
}

export default ParentLayout;