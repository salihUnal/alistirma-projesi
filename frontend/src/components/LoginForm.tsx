import React, { useState } from "react";
// import ThemeToggle from "./common/ThemeToggle";

interface LoginFormProps {
  onLogin: (username: string, role: string) => void;
  onTestPage: () => void;
}

function LoginForm({ onLogin, onTestPage }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      <div className="w-full max-w-md z-10">
        <h1 className="text-3xl font-serif mb-6 text-white text-center">
          Oturum Aç
        </h1>
        <div className="max-w-md mx-auto bg-transparent  backdrop-blur-sm border border-blue-400 p-6 rounded-lg shadow-lg ">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Kullanıcı Adınızı Giriniz"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="text"
              placeholder="Şifrenizi Giriniz"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
              type="submit"
              disabled={!username.trim()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              Giriş
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
