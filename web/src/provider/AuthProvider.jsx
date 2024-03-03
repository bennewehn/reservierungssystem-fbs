import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(function (
      config
    ) {
      const token = localStorage.getItem("token");
      config.headers.Authorization = `Bearer ${token}`;

      return config;
    });

    if (token) {
      localStorage.setItem("token", token);
    } else {
      // Remove request interceptor
      axios.interceptors.request.eject(requestInterceptor);
      localStorage.removeItem("token");
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
