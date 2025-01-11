import { useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from './utils/AppContext';

export const AppProvider = ({ children }) => {
   const [state, setState] = useState({
      token: localStorage.getItem('token'),
      user: null,
   });

   return (
      <AppContext.Provider value={{ state, setState }}>
         {children}
      </AppContext.Provider>
   );
};

export default AppProvider;
