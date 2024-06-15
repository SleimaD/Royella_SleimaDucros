import React, { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

const AuthContext = createContext({ user: null, token: null });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const savedUserJSON = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      const savedRefreshToken = localStorage.getItem("refreshToken");
      if (savedUserJSON) {
        const userData = JSON.parse(savedUserJSON);
        setUser(userData);
        setToken(userData.accessToken); 
        setRefreshToken(savedRefreshToken);
      }
      setLoading(false);
    }, []);

    const login = (userData) => {
      setUser(userData);
      setToken(userData.accessToken); 
      setRefreshToken(userData.refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.accessToken); 
      localStorage.setItem("refreshToken", userData.refreshToken);
    };

    const logout = () => {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    };
    
    
    useEffect(() => {
    console.log("Token set in AuthProvider:", token);
    }, [token]);
  

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };