import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingLabelInput from "./common/FloatingLabelInput";
import Copyright from "./common/Copyright";
import Register from "../pages/public/Register";
// import ThemeToggle from "./common/ThemeToggle";

interface LoginFormProps {
  onLogin: (username: string, role: string) => void;
  onTestPage: () => void;
}

function LoginForm({ onLogin, onTestPage }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userInput = username.trim().toLowerCase();

    if (userInput === "admin") {
      onLogin(username, userInput);
    } else if (userInput === "test") {
      // onLogin(username, "test");
      onTestPage();
    } else {
      window.location.href = "/unauthorized";
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
              disabled={!username.trim()}
              className=" w-full rounded-xl bg-blue-500 text-white text-md py-2 px-4  hover:bg-blue-700 disabled:bg-blue-300"
            >
              ➜] Giriş
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
