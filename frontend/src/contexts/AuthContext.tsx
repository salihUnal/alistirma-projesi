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
  token: string | null;
  login: (username: string, role: string, token: string) => void;
  logout: () => void;
  changeRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || "guest";
  });

  const login = (username: string, role: string, token: string) => {
    setToken(token);
    setIsLoggedIn(true);
    setUsername(username);
    setUserRole(role);

    // Bilgileri localStorage'a kaydet
    localStorage.setItem("token", token);
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
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    // Eski "isLoggedIn" anahtarını da temizleyelim
    localStorage.removeItem("isLoggedIn");
  };

  const changeRole = (role: string) => {
    setUserRole(role);
    // İsteğe bağlı: Rolü localStorage'da da güncelleyebilirsiniz
    localStorage.setItem("userRole", role);
  };

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        userRole,
        token,
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
