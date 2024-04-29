// src/context/PageStyleContext.js
import React, { createContext, useContext, useState } from 'react';

const PageStyleContext = createContext();

export const usePageStyle = () => useContext(PageStyleContext);

export const PageStyleProvider = ({ children }) => {
  const [pageStyle, setPageStyle] = useState('default');

  return (
    <PageStyleContext.Provider value={{ pageStyle, setPageStyle }}>
      {children}
    </PageStyleContext.Provider>
  );
};
