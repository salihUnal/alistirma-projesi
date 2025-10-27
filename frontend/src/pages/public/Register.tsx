import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import ThemeToggle from "../../components/common/ThemeToggle";
import FloatingLabelInput from "../../components/common/FloatingLabelInput";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          full_name: fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      // Başarılı kayıt
      setLoading(false);
      navigate("/"); // veya "/login" hangisi layout'ta ayarlıysa (mevcut layout'a göre "/")
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen px-4 py-8 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-background1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      {/* <div className=" fixed top-4 right-4 z-50 ">
        <ThemeToggle />
      </div> */}

      <div className="w-full max-w-md mx-auto p-6 rounded-3xl shadow-lg bg-transparent backdrop-blur-sm border border-blue-400 z-10">
        <h1 className="text-xl font-sans mb-6 text-white text-center">
          📝 Hesap Oluştur
        </h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          <FloatingLabelInput
            id="username"
            label="👤 Kullanıcı Adınız"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <FloatingLabelInput
            id="email"
            label="✉️ Email Adresiniz"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <FloatingLabelInput
            id="password"
            label="🗝️ Şifreniz (min 8 karakter)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <FloatingLabelInput
            id="fullName"
            label="Ad Soyad (İsteğe bağlı)"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />

          <button
            type="submit"
            disabled={loading || !username || !email || !password}
            className="w-full rounded-xl bg-green-500 text-white text-md py-2 px-4 hover:bg-green-700 disabled:bg-gray-400 mt-4"
          >
            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-white ">
            Zaten bir hesabınız var mı?{" "}
            <span
              onClick={() => navigate("/")} // LoginForm'un olduğu ana dizine yönlendir
              className="font-medium cursor-pointer text-orange-400 hover:text-blue-400"
            >
              Giriş yapın
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
