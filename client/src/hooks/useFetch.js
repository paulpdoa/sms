import axios from 'axios';
import { useEffect, useState } from 'react';

export const useFetch = (url) => {

   const [records,setRecords] = useState([]);
   const [isLoading,setIsLoading] = useState(false);

   const user = localStorage.getItem('user');

   const header = {
      'Authorization':`Bearer ${user?.token}` 
   }

   useEffect(() => {
      const abortCont = new AbortController();
      const signal = abortCont.signal;

      const fetchData = async () => {
         setIsLoading(true);
         try {
            const data = await axios.get(url,header,{ signal });
            setIsLoading(false);
            setRecords(data?.data);
         } catch(err) {
            console.log(err);
         }
      }
      fetchData();
      
      return () => abortCont.abort();
   },[url])
  
   return { records, isLoading } 
   
}