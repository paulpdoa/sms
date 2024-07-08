// MyContext.js
import React, { createContext, useState } from 'react';

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [searchQuery,setSearchQuery] = useState('');
  const role = localStorage.getItem('role');
  const session = localStorage.getItem('session');
  const currentUserId = localStorage.getItem('id');
  const currentUser = localStorage.getItem('username');

  return (
    <MainContext.Provider value={{ searchQuery,setSearchQuery,role,session,currentUserId, currentUser }}>
      {children}
    </MainContext.Provider>
  );
};
