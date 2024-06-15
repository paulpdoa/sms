import axios from 'axios';
import { useEffect, useState } from 'react';

export const useFetch = (url) => {

   const [records,setRecords] = useState([]);
   const [isLoading,setIsLoading] = useState(false);

   const userToken = localStorage.getItem('userToken');

   const header = {
      'Authorization':`Bearer ${userToken}` 
   }
   
   useEffect(() => {
      const abortCont = new AbortController();
      const signal = abortCont.signal;

      const fetchData = async () => {
         setIsLoading(true);
         try {
            const data = await axios.get(url,{ header });
            setIsLoading(false);
            setRecords(data?.data);
         } catch(err) {
            console.log(err);
         }
      }
      fetchData();
      
      return () => abortCont.abort();
   },[url,userToken])
  
   return { records, isLoading } 
}