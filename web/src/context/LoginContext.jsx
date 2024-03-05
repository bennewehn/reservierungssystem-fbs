import React, { createContext, useState, useContext } from "react";

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [rememberLogin, setRememberLogin] = useState(true);

  return (
    <LoginContext.Provider value={{ rememberLogin, setRememberLogin }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  return useContext(LoginContext);
};