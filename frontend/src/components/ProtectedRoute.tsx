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

  console.log(
    "ProtectedRoute - isLoggedIn:",
    isLoggedIn,
    "userRole:",
    userRole,
    "pathname:",
    location.pathname
  );

  if (!isLoggedIn) {
    console.log(
      "ProtectedRoute - Kullanıcı giriş yapmamış, yönlendiriliyor:",
      redirectTo
    );
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log("ProtectedRoute - Yetki yok, yönlendiriliyor: /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("ProtectedRoute - Erişim izni verildi");
  return <>{children}</>;
}

export default ProtectedRoute;
