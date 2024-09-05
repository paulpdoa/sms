import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { MainContext } from '../helpers/MainContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const useFetch = (url) => {

   const [records,setRecords] = useState([]);
   const [isLoading,setIsLoading] = useState(false);
   const [error,setError] = useState('');
   const [cookies, setCookie] = useCookies(['userToken']);

   const { session, role } = useContext(MainContext);

   const userToken = cookies.userToken;
   const navigate = useNavigate();

   const headers = {
      'Authorization':`Bearer ${userToken}` 
   }
   
   useEffect(() => {
      const abortCont = new AbortController();
      const signal = abortCont.signal;

      const fetchData = async () => {
         setIsLoading(true);
         try {
            const data  = await axios.get(url, {
               params: { role,session },
               signal,
               headers
            });
            if (!data.statusText === 'OK') throw new Error('Network response not ok');
            setIsLoading(false);
            setRecords(data.data);
         } catch(err) {
            console.log(err);
            const data = err.response?.data;
            setError(data.mssg);
            navigate(data.redirect);
            toast.error(data.mssg, {
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
      }
      fetchData();
      
      return () => abortCont.abort();
   },[url,userToken,role,navigate])
  
   return { records, isLoading } 
}