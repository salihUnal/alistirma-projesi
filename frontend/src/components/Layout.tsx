import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import MovieList from "../pages/MovieList";
import Header from "./Header";
import { useState } from "react";

function Layout() {
  const navigate = useNavigate();
  const { isLoggedIn, username, userRole, login, logout, changeRole } =
    useAuth();
  const [showTestPage, setShowTestPage] = useState(false);

  const handleLogin = (username: string, role: string) => {
    login(username, role);

    const stored = localStorage.getItem("redirectAfterLogin");
    const target =
      stored && stored !== "/unauthorized"
        ? stored
        : role === "admin"
        ? "/admin"
        : role === "test"
        ? "/movies/popular" // Test kullanıcısı için URL
        : "/";

    localStorage.removeItem("redirectAfterLogin");
    navigate(target, { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleRoleChange = (role: string) => {
    changeRole(role);
  };

  const handleTestPage = () => {
    setShowTestPage(true);
  };

  const handleBackToLogin = () => {
    setShowTestPage(false);
  };

  if (showTestPage) {
    return <MovieList onBack={handleBackToLogin} />;
  }

  return (
    // <div className="App bg-gray-300 rounded-r-3xl shadow-2xl p-8">
    <div
      className="
  relative min-h-screen
  bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200
  dark:from-slate-900 dark:via-slate-950 dark:to-black
"
    >
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} onTestPage={handleTestPage} />
      ) : (
        <>
          {/* <div className="text-green-600 font-semibold italic text-4xl"> */}
          {userRole !== "admin" && <Header />}
          {/* </div> */}
          <Outlet />
          <Dashboard
            username={username}
            userRole={userRole}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onRoleChange={handleRoleChange}
          />
        </>
      )}
    </div>
  );
}

export default Layout;
