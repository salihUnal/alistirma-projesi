import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Movies from "../components/Movies";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/common/ThemeToggle";

// import Pagination from "../components/Pagination";

interface TestPageProps {
  onBack: () => void;
}

function MovieList({ onBack }: TestPageProps) {
  const { username } = useAuth();
  console.log("Username:", username);
  console.log("Username type:", typeof username);
  console.log("Username length:", username?.length);
  const { category, page: urlPage } = useParams();
  const [currentPage, setCurrentPage] = useState("Dashboard");
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [totalMovies, setTotalMovies] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (urlPage) {
      setPage(parseInt(urlPage));
    }
  }, [urlPage]);

  useEffect(() => {
    if (category) {
      setCurrentPage("Filmler");
    }
  }, [category]);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [page]);

  // const handlePageChange = (newPage: number) => {
  //   setPage(newPage);
  //   navigate(`/movies/${category || "popular"}/${newPage}`);
  // };

  // Kategori bazlı client-side filtreleme ileride yeniden eklenecek

  const handleSidebarClick = (label: string) => {
    setCurrentPage(label);

    // Sidebar butonlarına göre URL değiştir
    const urlMap: Record<string, string> = {
      Filmler: "/movies",
      Suç: "/movies/action",
      Drama: "/movies/drama",
      Fantastik: "/movies/fantasy",
      "Bilim Kurgu": "/movies/scifi",
      Aksiyon: "/movies/action",
      Komedi: "/movies/comedy", // Komedi için popular
      Korku: "/movies/thriller",
      Gençlik: "/movies/teen",
      Trend: "/movies/trend",
      Gerilim: "/movies/thriller",
      "Çizgi Roman": "/movies/fantasy",
    };

    const targetUrl = urlMap[label] || "/movies/popular";
    navigate(targetUrl);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "Filmler":
        return (
          <div className="border-separate border-blue-200 dark:border-blue-700 border-4 bg-white dark:bg-gray-800 p-6 mt-10 rounded-lg shadow ">
            <div className="mb-1">
              <h3 className="  md:grid-cols-2 text-3xl font-extrabold italic text-gray-800 dark:text-white mb-3">
                {category
                  ? `${category.toLocaleUpperCase("tr-TR")} Filmleri`
                  : "🎬 Tüm Filmler"}{" "}
              </h3>
              {/* Filtre butonları */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate("/movies")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    !category // ✅ Doğru! Tümü butonu için
                      ? "bg-blue-500 text-white"
                      : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                  }`}
                >
                  Tümü
                </button>
                <button
                  onClick={() => navigate("/movies/drama")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "drama"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                  }`}
                >
                  Drama
                </button>
                <button
                  onClick={() => navigate("/movies/thriller")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "thriller"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Gerilim
                </button>
                <button
                  onClick={() => navigate("/movies/scifi")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "scifi"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Bilim Kurgu
                </button>
                <button
                  onClick={() => navigate("/movies/fantasy")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "fantasy"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Fantastik
                </button>
                <button
                  onClick={() => navigate("/movies/action")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "action"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Aksiyon
                </button>
                <button
                  onClick={() => navigate("/movies/teen")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "teen"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Gençlik
                </button>
                <button
                  onClick={() => navigate("/movies/trending")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "trending"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Trend
                </button>
              </div>
            </div>
            <Movies category={category} />
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
      {/* Sabit çıkış butonu */}
      <div
        className="grid grid-cols-2 absolute top-4 right-4 z-50  mr-1"
        role="group"
      >
        <ThemeToggle />
        <button
          type="button"
          onClick={onBack}
          className="bg-orange-500 hover:bg-red-700 text-white px-1 py-1 mr-0 rounded-lg shadow-lg transition-colors duration-200"
        >
          Çıkış Yap
        </button>
      </div>
      <div className="flex gap-3 text-center">
        <Sidebar title="Menü" onItemClick={handleSidebarClick} />
        <div className="flex-auto">
          <h1 className="text-3xl text-center font-bold mb-6 text-gray-900 dark:text-white">
            Filmler
          </h1>
          {renderContent()}
        </div>
      </div>
      <div className="bg-white-100">
        <footer className="text-center  text-lg font-thin italic capitalize py-1">
          Powered By {username?.trim() || "Misafir"}
        </footer>
        {/* kullanıcı adı görünmüyor. düzelt*/}
      </div>
    </div>
  );
}

export default MovieList;
