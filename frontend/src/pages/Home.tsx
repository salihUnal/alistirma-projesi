import React from "react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/common/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { username, logout } = useAuth();

  return (
    <div className="w-full min-h-screen px-4 py-8 dark:bg-slate-900 text-white">
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200/60 dark:border-slate-700/60 rounded-lg">
        {/* Sol: Logo */}
        <div className="flex items-center gap-3">
          <img
            src="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2040%2040'%20width='480'%20height='480'%3e%3cpath%20fill='none'%20stroke='%234788c7'%20stroke-linecap='round'%20stroke-width='2'%20d='M31,17v16%20c0,0-0.108,5.033,5,5.033L38,38'%20/%3e%3cpath%20fill='%23dff0fe'%20d='M17,32.5C8.453,32.5,1.5,25.547,1.5,17S8.453,1.5,17,1.5S32.5,8.453,32.5,17S25.547,32.5,17,32.5z'%20/%3e%3cpath%20fill='%234788c7'%20d='M17,2c8.271,0,15,6.729,15,15s-6.729,15-15,15S2,25.271,2,17S8.729,2,17,2%20M17,1%20C8.163,1,1,8.163,1,17s7.163,16,16,16s16-7.163,16-16S25.837,1,17,1L17,1z'%20/%3e%3cpath%20fill='%2398ccfd'%20d='M17%205.5A3.5%203.5%200%201%200%2017%2012.5A3.5%203.5%200%201%200%2017%205.5Z'%20/%3e%3cpath%20fill='%234788c7'%20d='M17,6c1.654,0,3,1.346,3,3c0,1.654-1.346,3-3,3s-3-1.346-3-3C14,7.346,15.346,6,17,6%20M17,5%20c-2.209,0-4,1.791-4,4s1.791,4,4,4s4-1.791,4-4S19.209,5,17,5L17,5z'%20/%3e%3cpath%20fill='%2398ccfd'%20d='M17%2021.5A3.5%203.5%200%201%200%2017%2028.5A3.5%203.5%200%201%200%2017%2021.5Z'%20/%3e%3cpath%20fill='%234788c7'%20d='M17,22c1.654,0,3,1.346,3,3s-1.346,3-3,3s-3-1.346-3-3S15.346,22,17,22%20M17,21c-2.209,0-4,1.791-4,4%20s1.791,4,4,4s4-1.791,4-4S19.209,21,17,21L17,21z'%20/%3e%3cg%3e%3cpath%20fill='%2398ccfd'%20d='M9%2013.5A3.5%203.5%200%201%200%209%2020.5A3.5%203.5%200%201%200%209%2013.5Z'%20/%3e%3cpath%20fill='%234788c7'%20d='M9,14c1.654,0,3,1.346,3,3s-1.346,3-3,3s-3-1.346-3-3S7.346,14,9,14%20M9,13c-2.209,0-4,1.791-4,4%20s1.791,4,4,4s4-1.791,4-4S11.209,13,9,13L9,13z'%20/%3e%3c/g%3e%3cg%3e%3cpath%20fill='%2398ccfd'%20d='M25%2013.5A3.5%203.5%200%201%200%2025%2020.5A3.5%203.5%200%201%200%2025%2013.5Z'%20/%3e%3cpath%20fill='%234788c7'%20d='M25,14c1.654,0,3,1.346,3,3s-1.346,3-3,3s-3-1.346-3-3S23.346,14,25,14%20M25,13c-2.209,0-4,1.791-4,4%20s1.791,4,4,4s4-1.791,4-4S27.209,13,25,13L25,13z'%20/%3e%3c/g%3e%3cpath%20fill='%234788c7'%20d='M17,15C16.765,15,17.235,15,17,15c-1.105,0-2,0.895-2,2s0.895,2,2,2c0.235,0-0.235,0,0,0%20c1.105,0,2-0.895,2-2S18.105,15,17,15z'%20/%3e%3c/svg%3e"
            alt="Uygulama Logosu"
            className="w-10 h-10 shrink-0 cursor-pointer"
            role="button"
            onClick={() => navigate("/")}
          />
          <span className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Blog ve Multimedya Uygulaması
          </span>
        </div>

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
