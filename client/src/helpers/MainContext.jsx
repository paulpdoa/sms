// MyContext.js
import React, { createContext, useState } from 'react';
import { baseUrl } from '../baseUrl';
import { useFetch } from '../hooks/useFetch';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';

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
  const role = localStorage.getItem('role') || 'Guest';
  const isFreshYear = localStorage.getItem('isFreshYear');

  // For setting teachers current selectedSubject
  const [teacherSubjectSelected,setTeacherSubjectSelected] = useState('');
  const [teacherSectionSelected,setTeacherSectionSelected] = useState('');

  const genericPath = role === 'Super Admin' ? 'master' : role.replace(" ","").toLowerCase();

  const { enqueueSnackbar } = useSnackbar();

  // For loading notification
  const snackbarKey = (message) => {
    return enqueueSnackbar(message || '', { 
        variant: 'info',
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
        },
        persist: true,
        preventDuplicate: true
    });
  }

  // For success/error notification
  const snackbarMessage = (message,status,duration) => {
    return enqueueSnackbar(message || '', { 
        variant: status,
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
        },
        persist: true,
        preventDuplicate: true,
        autoHideDuration: duration,
    }); 
  }



  const numberFormatter = (number, decimalPlaces = 2) => {
    // Use toFixed to round the number and ensure it has decimal places
    const roundedNumber = Number(number).toFixed(decimalPlaces);
    
    // Split the rounded number into integer and decimal parts
    const [integerPart, decimalPart] = roundedNumber.split('.');
  
    // Format the integer part with commas
    const formattedInteger = new Intl.NumberFormat().format(integerPart);
  
    // Return the formatted integer and decimal parts together
    return `${formattedInteger}.${decimalPart}`;
  };

  const dateFormatter = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric' 
      })
  }
  

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
      setCurrStudRec,
      genericPath,
      teacherSubjectSelected,
      setTeacherSubjectSelected,
      teacherSectionSelected,
      setTeacherSectionSelected,
      snackbarKey,
      numberFormatter,
      dateFormatter,
      snackbarMessage
    }}>
      {children}
    </MainContext.Provider>
  );
};
