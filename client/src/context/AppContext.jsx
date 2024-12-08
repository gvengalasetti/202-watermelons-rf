import React, { createContext, useState, useContext } from "react";

// Create the context
const AppContext = createContext();

// Provider component to wrap your app
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user state

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useAppContext = () => {
  return useContext(AppContext);
};
