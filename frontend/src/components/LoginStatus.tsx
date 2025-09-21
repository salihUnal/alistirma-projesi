import { useState } from "react";

function LoginStatus() {
  // useState hook'ları component içinde olmalı
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Fonksiyonlar da component içinde olmalı
  const handleLogin = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <div className="text-green-600">
      {isLoggedIn ? (
        <div>Hoşgeldin, {username}!</div>
      ) : (
        <div>Lütfen giriş yapın</div>
      )}
      {/*     <h1>Login Status</h1>
      <p>Username: {username}</p>
      <p>Is Logged In: {isLoggedIn ? "Yes" : "No"}</p>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button> */}
    </div>
  );
}

export default LoginStatus;
