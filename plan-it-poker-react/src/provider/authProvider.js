import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(localStorage.getItem("jwt"));
  const [error, setError] = useState(null);

  const setToken = (newToken) => {
    try {
      setToken_(newToken);
      localStorage.setItem("jwt", newToken);
      setError(null);
    } catch (err) {
      setError("Token error");
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("jwt", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("jwt");
    }
  }, [token]);

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setToken(null);
          localStorage.removeItem("jwt");
        }
        return Promise.reject(error);
      },
    );

    // Curăță interceptorul la demontare
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // Valoarea contextului memorizată
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      error,
    }),
    [token, error],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth trebuie folosit într-un AuthProvider");
  }
  return context;
};
