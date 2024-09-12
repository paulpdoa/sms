import { Outlet,useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { MainContext } from '../helpers/MainContext';
import { useCookies } from 'react-cookie';

const TeacherLayout = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

    const { role,username } = useContext(MainContext);
    const navigate = useNavigate();

    const isLoading = role === undefined
    useEffect(() => {
        if(!isLoading) {
            if(role !== 'Teacher') {
                removeCookie('userToken',{ path: '/teacher' });
                ['id','currentUserId','session','role','username'].forEach(lclstg => localStorage.removeItem(lclstg));
                navigate('/login');
            }
        }
    },[role,removeCookie,navigate]); 

    return (
        <Outlet />
    )
}

export default TeacherLayout