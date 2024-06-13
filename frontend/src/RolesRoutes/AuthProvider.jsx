import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({ user: null });


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUserJSON = localStorage.getItem("user");
            console.log('Retrieved user:', savedUserJSON); 
            if (savedUserJSON) {
                const savedUser = JSON.parse(savedUserJSON);
                if (savedUser && typeof savedUser === 'object') { //? Check if parsed data is an object
                    setUser(savedUser);
                }
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
        }
        setLoading(false);
    }, []);


    const login = (userData) => {
        try {
            console.log("Login userData received:", userData)
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
            console.error("Failed to save user to localStorage:", error);
        }
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };