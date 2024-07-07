import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useFetch = (url) => {

   const [records,setRecords] = useState([]);
   const [isLoading,setIsLoading] = useState(false);
   const [error,setError] = useState('');

   const userToken = localStorage.getItem('userToken');
   const role = localStorage.getItem('role');
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
               params: { role },
               signal,
               headers
            });
            if (!data.statusText === 'OK') throw new Error('Network response not ok');
            setIsLoading(false);
            setRecords(data.data);
         } catch(err) {
            const data = err.response?.data;
            console.log(data);
            setError(data.mssg);
            navigate(data.redirect);
         }
      }
      fetchData();
      
      return () => abortCont.abort();
   },[url,userToken,role,navigate])
  
   return { records, isLoading } 
}