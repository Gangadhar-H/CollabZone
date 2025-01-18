import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/getUser`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });
                    setUser(response.data);
                } catch (error) {
                    console.log("Invalid Token: ", error);
                    logout();
                }
            }
        };

        fetchUser();
    }, [token]);

    const login = (userData, jwtToken) => {
        console.log("Logging in user:", userData);
        console.log("Token : ", jwtToken);
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem("token", jwtToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{ user, token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};