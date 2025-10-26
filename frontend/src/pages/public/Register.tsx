import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/common/ThemeToggle";

export default function Register() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3">
      <div className=" fixed top-4 right-4 z-50 ">
        <ThemeToggle />
      </div>
      <div className="p-6 ">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 rounded-lg  bg-blue-500  dark:bg-blue-400 text-white hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
        >
          Geri
        </button>
        <div>
          <h1>Kayıt Sayfası</h1>
        </div>
      </div>
    </div>
  );
}
