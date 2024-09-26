import { Outlet,useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { MainContext } from '../helpers/MainContext';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';

const FinanceLayout = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

    const { role,username } = useContext(MainContext);
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const isLoading = role === undefined
    useEffect(() => {
        if(!isLoading) {
            if(role !== 'Finance') {
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
    },[role,removeCookie,navigate]); 

    return (
        <>
            {/* Render the Outlet to display child routes */}
            <Outlet />
        </>
    )
}

export default FinanceLayout;