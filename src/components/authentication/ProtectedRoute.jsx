import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authData } = useAuth();

  if (!authData) {
    return <Navigate to="/login" />;
  }

  const { role } = authData.user;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;

