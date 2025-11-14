import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/common/ThemeToggle";

interface PoemsProps {
  onBack: () => void;
}

function Poems({ onBack }: PoemsProps) {
  const { username, logout } = useAuth();
  const { category } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("Şiirler");

  useEffect(() => {
    setCurrentPage("Şiirler");
  }, [category]);

  const renderContent = () => {
    switch (currentPage) {
      case "Şiirler":
        return (
          <div className="border-separate border-blue-200 dark:border-blue-700 border-2 bg-white dark:bg-gray-800 p-6 mt-10 rounded-lg shadow">
            <div className="mb-1">
              <h3 className="text-center md:grid-cols-2 text-2xl font-bold italic text-gray-800 dark:text-white mb-3">
                🪶 Sevdiğim Şiirler alt
              </h3>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Henüz Şiirler eklenmemiş. Yukarıdaki alandan Şiirler
                ekleyebilirsiniz.
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen px-4 py-8 dark:bg-slate-900 text-white">
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200/60 dark:border-slate-700/60 rounded-lg">
        <Link to="/poems/" className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dklvz02ew/image/upload/v1763127284/poem_logo_np5xdk.svg"
            alt="Uygulama Logosu"
            className="w-12 h-12 shrink-0 "
            // role="button"
            // onClick={() => navigate("/books/Tumu")}
          />
          <span className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Şiirlerin Listesi
          </span>
        </Link>

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
      <div className="mt-4 flex gap-3">
        <div className="w-64 shrink-0">
          <Sidebar title="Menü" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl text-center font-bold mb-6 text-gray-900 dark:text-white">
            Şiirler
          </h1>
          {renderContent()}
        </div>
      </div>

      <div className="bg-white-100">
        <footer className="text-center text-lg text-black dark:text-white font-thin italic capitalize py-1">
          Powered By{" "}
          <span className="font-semibold not-italic text-cyan-500 dark:text-cyan-400">
            {username?.trim() || "Misafir"}
          </span>
        </footer>
      </div>
    </div>
  );
}

export default Poems;
