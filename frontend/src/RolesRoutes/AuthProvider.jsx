import React, { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

const AuthContext = createContext({ user: null, token: null });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUserJSON = localStorage.getItem("user");
    return savedUserJSON ? JSON.parse(savedUserJSON) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUserJSON = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    const savedRefreshToken = localStorage.getItem("refreshToken");

    if (savedUserJSON) {
      setUser(JSON.parse(savedUserJSON));
    }
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedRefreshToken) {
      setRefreshToken(savedRefreshToken);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log("User data on login:", userData);
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.accessToken);
    localStorage.setItem("refreshToken", userData.refreshToken);

    setUser(userData.user);
    setToken(userData.accessToken);
    setRefreshToken(userData.refreshToken);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    setUser(null);
    setToken(null);
    setRefreshToken(null);
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  useEffect(() => {
    console.log("Token read from localStorage:", localStorage.getItem("token"));
    console.log("Token set in state:", token);
  }, [token]);


  return (
    <AuthContext.Provider value={{ user, token, refreshToken, login, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };