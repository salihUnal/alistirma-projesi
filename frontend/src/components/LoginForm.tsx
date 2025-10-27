import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingLabelInput from "./common/FloatingLabelInput";
import Copyright from "./common/Copyright";
// import Register from "../pages/public/Register";
// import ThemeToggle from "./common/ThemeToggle";

interface LoginFormProps {
  onLogin: (username: string, role: string, token: string) => void;
  onTestPage: () => void;
}

function LoginForm({ onLogin, onTestPage }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const userInput = username.trim();

    // 'test' kullanıcısı girişini koruyalım (çevrimdışı test için)
    if (userInput.toLowerCase() === "test") {
      setLoading(false);
      onTestPage();
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userInput,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Giriş yapılamadı");
      }

      // Başarılı giriş
      setLoading(false);
      // AuthContext'i token ile güncelle
      onLogin(data.user.username, data.user.role, data.token);
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    // <div className="relative w-full  min-h-screen px-4 py-8 flex items-center bg-slate-100 justify-center dark:bg-slate-900">
    <div
      className="relative w-full min-h-screen px-4 py-8 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-background1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      {/* <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div> */}

      <div className="w-full max-w-md mx-auto p-6 rounded-3xl shadow-lg bg-transparent  backdrop-blur-sm border border-blue-400  ">
        <div className="w-full max-w-md z-10">
          <h1 className="text-xl font-sans mb-6 text-white text-center">
            🔐 Oturum Aç
          </h1>
          <form onSubmit={handleSubmit}>
            {/* <input
              type="text"
              placeholder="Kullanıcı Adınızı Giriniz"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="password"
              placeholder="Şifrenizi Giriniz"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            /> */}
            {error && <p className="text-red-400 text-center mb-4">{error}</p>}
            <FloatingLabelInput
              id="username"
              label="👤 Kullanıcı Adınız"
              type="text"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              autoComplete="username"
            />

            <FloatingLabelInput
              id="password"
              label="🗝️ Şifreniz"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
            />
            {/* <button
              type="submit"
              disabled={!username.trim()}
              className=" w-auto rounded-xl bg-blue-500 text-white text-md py-2 px-4  hover:bg-blue-600 disabled:bg-blue-300"
            >
              ➜] Kayıt Ol
            </button> */}
            <button
              type="submit"
              disabled={!username.trim() || !password.trim() || loading}
              className=" w-full rounded-xl bg-blue-500 text-white text-md py-2 px-4  hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Giriş yapılıyor..." : "➜] Giriş"}
            </button>
            <div className="text-center ">
              {/* register sayfasına yönelendirmeiyor. muhtemelen loyault tarafından  değişiklik lazım */}
              <p className="text-sm text-white ">
                Hesabınız yok mu?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="font-medium cursor-pointer  text-orange-400 hover:text-blue-400"
                >
                  Hesap oluşturun
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>

      <footer className="absolute bottom-0 w-full pb-4 text-center text-sm text-white dark:text-white font-thin italic capitalize backdrop-blur-sm bg-black/30 ">
        <Copyright companyName="SalihOlmaYolu" startYear={2003} />
      </footer>
    </div>
  );
}

export default LoginForm;
