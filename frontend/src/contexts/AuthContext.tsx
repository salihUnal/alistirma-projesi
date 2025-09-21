import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  userRole: string;
  login: (username: string, role: string) => void;
  logout: () => void;
  changeRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || " ";
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || "guest";
  });

  const login = (username: string, role: string) => {
    setIsLoggedIn(true);
    setUsername(username);
    setUserRole(role);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    localStorage.setItem("userRole", role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setUserRole("guest");
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("username", "");
    localStorage.setItem("userRole", "guest");
  };

  const changeRole = (role: string) => {
    setUserRole(role);
  };

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        userRole,
        login,
        logout,
        changeRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
