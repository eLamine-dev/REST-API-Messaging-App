import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { AppContext } from './utils/AppContext';

export const AppProvider = ({ children }) => {
   const [state, setState] = useState({
      user: null,
      activeConversation: null,
   });

   return (
      <AppContext.Provider value={{ state, setState }}>
         {children}
      </AppContext.Provider>
   );
};

AppProvider.propTypes = {
   children: PropTypes.node.isRequired,
};

export default AppProvider;
