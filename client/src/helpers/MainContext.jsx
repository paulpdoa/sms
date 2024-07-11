// MyContext.js
import React, { createContext, useState } from 'react';

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [searchQuery,setSearchQuery] = useState('');
  // For showing forms in master data
  const [showForm,setShowForm] = useState(false);
  
  const session = localStorage.getItem('session');
  const currentUserId = localStorage.getItem('id');
  const currentUser = localStorage.getItem('username');
  const userToken = localStorage.getItem('userToken');
  const role = localStorage.getItem('role');

  return (
    <MainContext.Provider value={{ 
      searchQuery,
      setSearchQuery,
      role,session,
      currentUserId, 
      currentUser,
      userToken,
      showForm,
      setShowForm 
    }}>
      {children}
    </MainContext.Provider>
  );
};
