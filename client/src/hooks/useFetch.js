import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { MainContext } from '../helpers/MainContext';

export const useFetch = (url) => {
   const [records, setRecords] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const [cookies] = useCookies(['userToken']);

   const { session, role, isFreshYear } = useContext(MainContext);

   const userToken = cookies.userToken;
   const navigate = useNavigate();

   const headers = {
      'Authorization': `Bearer ${userToken}`,
   };

   useEffect(() => {

      // abort everything if isFreshYear is present
      // Abort fetching if no session and isFreshYear is not present
      // if(!session) {
      //    return; // Do nothing if no session and isFreshYear is missing
      // } 

      const abortCont = new AbortController();
      const signal = abortCont.signal;

      const fetchData = async () => {
         setIsLoading(true);
         try {
            const response = await axios.get(url, {
               params: { role, session },
               signal,
               headers,
            });

            if (response.status !== 200) {
               throw new Error('Failed to fetch data');
            }

            setRecords(response.data);
            setIsLoading(false);
         } catch (err) {
            setIsLoading(false);

            // Network or timeout errors
            if (!err.response) {
               setError('Network error, please try again later');
               return;
            }

            // API returned an error response
            const data = err.response.data;
            setError(data.mssg || 'An error occurred');
            
            // Redirect if specified in the error response
            if (data.redirect) {
               navigate(data.redirect);
            }
         }
      };

      fetchData();

      return () => abortCont.abort();
   }, [url, userToken, role, navigate]);

   return { records, isLoading, error };
};
