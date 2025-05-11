import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Starea pentru token și erori
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [error, setError] = useState(null);

  // Funcție pentru actualizarea token-ului
  const setToken = (newToken) => {
    try {
      setToken_(newToken);
      setError(null);
    } catch (err) {
      setError("Eroare la gestionarea token-ului");
    }
  };

  // Actualizează headerul Axios și localStorage la schimbarea token-ului
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Interceptor pentru răspunsuri neautorizate
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setToken(null);
          localStorage.removeItem("token");
        }
        return Promise.reject(error);
      }
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
    [token, error]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth trebuie folosit într-un AuthProvider");
  }
  return context;
};
