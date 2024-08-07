import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { MainContext } from '../helpers/MainContext';
import { toast } from 'react-toastify';

export const usePost = async (url,postData,redirectPath) => {

//    const [error,setError] = useState('');
//    const [cookies, setCookie] = useCookies(['userToken']);

//    const { session, role } = useContext(MainContext);

//    const userToken = cookies.userToken;
   const navigate = useNavigate();

   try {
        const data = await axios.post(url,postData);
        console.log(data);
        toast.success(data.data.mssg, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });

        setTimeout(() => {
            navigate(redirectPath);
        })
   } catch(err) {
        console.log(err);
        toast.error(err.response.data.mssg, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });
   }
   
   return { records, isLoading } 
}