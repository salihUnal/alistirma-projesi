import React, { useState } from "react";

interface LoginFormProps {
  onLogin: (username: string, role: string) => void;
  onTestPage: () => void;
}

function LoginForm({ onLogin, onTestPage }: LoginFormProps) {
  const [username, setUsername] = useState("");

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
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">Giriş Yapınız</h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Kullanıcı Adınızı Giriniz"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
