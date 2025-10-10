import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Books from "../components/Books";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/common/ThemeToggle";

interface BookListPageProps {
  onBack: () => void;
}

function BookList({ onBack }: BookListPageProps) {
  const { username } = useAuth();
  const { category } = useParams();
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      setCurrentPage("Kitaplar");
    }
  }, [category]);

  const handleSidebarClick = (label: string) => {
    setCurrentPage(label);

    const urlMap: Record<string, string> = {
      Kitaplar: "/books",
      Roman: "/books/Roman",
      "Bilim Kurgu Kitap": "/books/Bilim-Kurgu",
      Tarih: "/books/Tarih",
    };

    const targetUrl = urlMap[label] || "/books";
    navigate(targetUrl);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "Kitaplar":
        return (
          <div className="border-separate border-blue-200 dark:border-blue-700 border-2 bg-white dark:bg-gray-800 p-6 mt-10 rounded-lg shadow">
            <div className="mb-1">
              <h3 className="text-center md:grid-cols-2 text-2xl font-bold italic text-gray-800 dark:text-white mb-3">
                {category ? `📚 ${category} Kitapları` : "📚 Tüm Kitaplar"}
              </h3>
              {/* Filtre butonları */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate("/books")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    !category
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Tümü
                </button>
                <button
                  onClick={() => navigate("/books/Roman")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Roman"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Roman
                </button>
                <button
                  onClick={() => navigate("/books/Bilim-Kurgu")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Bilim-Kurgu"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Bilim Kurgu
                </button>
                <button
                  onClick={() => navigate("/books/Tarih")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Tarih"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Tarih
                </button>
              </div>
            </div>
            <Books category={category} />
          </div>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p>Ana sayfa içeriği burada...</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen px-4 py-8 dark:bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200/60 dark:border-slate-700/60 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Kitap Uygulaması
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={onBack}
            className="rounded-md bg-orange-500 px-3 py-2 text-white shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-slate-900 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <div className="w-64 shrink-0">
          <Sidebar title="Menü" onItemClick={handleSidebarClick} />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl text-center font-bold mb-6 text-gray-900 dark:text-white">
            Kitaplar
          </h1>
          {renderContent()}
        </div>
      </div>

      <div className="bg-white-100">
        <footer className="text-center text-lg font-thin italic capitalize py-1">
          Powered By {username?.trim() || "Misafir"}
        </footer>
      </div>
    </div>
  );
}

export default BookList;
