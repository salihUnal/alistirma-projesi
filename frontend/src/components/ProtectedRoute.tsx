// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { isLoggedIn, userRole } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
