import React from "react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/common/ThemeToggle";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { username, logout } = useAuth();

  return (
    <div className="w-full min-h-screen px-4 py-8 dark:bg-slate-900 text-white">
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200/60 dark:border-slate-700/60 rounded-lg">
        {/* Sol: Logo */}
        {/* <div className="flex items-center gap-3"> */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="\images\home-logo.png"
            alt="Uygulama Logosu"
            className="cursor-pointer w-10 h-10 shrink-0 "
            role="button"
            onClick={() => navigate("/")}
          />
          <span
            className="cursor-pointer text-2xl font-semibold text-slate-800 dark:text-slate-100"
            onClick={() => navigate("/")}
          >
            Blog ve Multimedya Uygulaması
          </span>
        </Link>
        {/* </div> */}

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="rounded-md bg-orange-500 px-3 py-2 text-white shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-slate-900 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-3 ">
        {/* Sidebar’a sabit genişlik vererek yapıyı koru */}
        <div className="w-64 shrink-0 ">
          <Sidebar title="Menü" />
        </div>
      </div>

      <div className="bg-white-100">
        <footer className="text-center  text-lg font-thin italic capitalize py-1">
          Powered By {username?.trim() || "Misafir"}{" "}
        </footer>
        {/* kullanıcı adı görünmüyor. düzelt*/}{" "}
      </div>
    </div>
  );
}

export default Home;
