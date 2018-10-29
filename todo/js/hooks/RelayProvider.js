import React from 'react';
import RelayContext from './RelayContext';

const RelayProvider = ({ environment, children }) =>  (
  // we pass empty variables even if it's dirty :D and will prevent some fragment
  // to works correctly
  <RelayContext.Provider value={{ environment, variables: {} }}>
    {children}
  </RelayContext.Provider>
);


export default RelayProvider;