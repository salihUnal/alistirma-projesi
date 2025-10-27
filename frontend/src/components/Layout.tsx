import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import Header from "./Header";
import { useState } from "react";
// import ThemeToggle from "./common/ThemeToggle";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, username, userRole, login, logout, changeRole } =
    useAuth();
  const [showTestPage, setShowTestPage] = useState(false); // Bu 'test' kullanıcısı için

  const handleLogin = (username: string, role: string, token: string) => {
    login(username, role, token);

    const stored = localStorage.getItem("redirectAfterLogin");
    // const target =
    //   stored && stored !== "/unauthorized"
    //     ? stored
    //     : role === "admin"
    //     ? "/admin"
    //       : "/";

    const target =
      stored && stored !== "/unauthorized"
        ? stored
        : role === "admin"
        ? "/admin"
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
    login("test", "test", "fake-test-token");
    setShowTestPage(true);
  };

  // const handleBackToLogin = () => {
  //   setShowTestPage(false);
  // };

  // if (showTestPage) {
  //   return <MovieList onBack={handleBackToLogin} />;
  // }

  return (
    // <div className="App bg-gray-300 rounded-r-3xl shadow-2xl p-8">
    <div
      className="
    relative min-h-screen w-full
  bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200
  dark:from-slate-900 dark:via-slate-950 dark:to-black
"
    >
      {!isLoggedIn ? (
        location.pathname === "/register" ? (
          <Outlet /> // Register sayfasını göster
        ) : (
          <LoginForm onLogin={handleLogin} onTestPage={handleTestPage} /> // Login sayfasını göster
        )
      ) : (
        // Kullanıcı giriş yapmışsa
        <>
          {userRole !== "test" && <Header />}
          <Outlet />
          {userRole !== "test" && (
            <Dashboard
              username={username}
              userRole={userRole}
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
              onRoleChange={handleRoleChange}
            />
          )}
          {/* 'test' kullanıcısı için özel bir dashboard/çıkış vs. gerekiyorsa buraya ekleyebilirsiniz */}
        </>
      )}
    </div>
  );
}

export default Layout;
