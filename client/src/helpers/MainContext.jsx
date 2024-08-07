// MyContext.js
import React, { createContext, useState } from 'react';
import { baseUrl } from '../baseUrl';
import { useFetch } from '../hooks/useFetch';
import { useCookies } from 'react-cookie';

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [searchQuery,setSearchQuery] = useState('');
  // For showing forms in master data
  const [showForm,setShowForm] = useState(false);

  const [cookies, setCookie] = useCookies(['userToken']);

  // Modification on Admission, Assessment page
  const [currStudRec, setCurrStudRec] = useState(null);
  
  const session = localStorage.getItem('session');
  const currentUserId = localStorage.getItem('id');
  const currentUser = localStorage.getItem('username');
  const userToken = cookies.userToken;
  const role = localStorage.getItem('role');
  const isFreshYear = localStorage.getItem('isFreshYear');

  return (
    <MainContext.Provider value={{ 
      searchQuery,
      setSearchQuery,
      role,
      session,
      currentUserId, 
      currentUser,
      userToken,
      showForm,
      setShowForm,
      isFreshYear,
      currStudRec,
      setCurrStudRec
    }}>
      {children}
    </MainContext.Provider>
  );
};
