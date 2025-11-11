import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return user && token ? { user: JSON.parse(user), token } : null;
  });

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuthData({ user: data.user, token: data.token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    setAuthData(null);
  };

  const updateUser = (newData) => {
    if (authData) {
      const updatedUser = { ...authData.user, ...newData }; 
      localStorage.setItem("user", JSON.stringify(updatedUser)); 
      setAuthData((prevData) => ({ ...prevData, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    toast.error("useAuth must be used within an AuthProvider");
  }
  return context;
};
