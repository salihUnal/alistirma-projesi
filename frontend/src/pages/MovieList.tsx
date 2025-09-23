import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Movies from "../components/Movies";
// import Pagination from "../components/Pagination";

interface TestPageProps {
  onBack: () => void;
}

function MovieList({ onBack }: TestPageProps) {
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
      Gençlik: "/movies/trending",
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
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
              {category ? `${category.toLocaleUpperCase('tr-TR')} Filmleri` : "Tüm Filmler"}              </h3>
              {/* Filtre butonları */}
              <div className="flex flex-wrap gap-2">
                {/* ... filtre butonları ... */}
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
  // const renderContent = () => {
  //   switch (currentPage) {
  //     case "Filmler":
  //       if (loading) {
  //         return (
  //           <div className="flex justify-center items-center h-64">
  //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  //             <span className="ml-3 text-gray-600">Filmler yükleniyor...</span>
  //           </div>
  //         );
  //       }

  //       if (error) {
  //         return (
  //           <div className="text-center py-8">
  //             <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
  //             <button
  //               onClick={() => window.location.reload()}
  //               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  //             >
  //               Tekrar Dene
  //             </button>
  //           </div>
  //         );
  //       }

  //       return (
  //         <div>
  //           {/* Kategori bilgisi
  //           <div className="mb-6">
  //             <h3 className="text-lg font-semibold mb-3">
  //               {category ? `${category} Filmleri` : "Tüm Filmler"}
  //             </h3>
  //             <p className="text-gray-600 mb-4">
  //               {totalMovies} film bulundu (Sayfa {page} / {totalPages})
  //             </p>

  //             {/* Filtre butonları */}
  //             <div className="flex flex-wrap gap-2">
  //               <button
  //                 onClick={() => navigate("/movies")}
  //                 className={`px-3 py-1 rounded-full text-sm ${
  //                   !category
  //                     ? "bg-blue-500 text-white"
  //                     : "bg-gray-200 text-gray-700"
  //                 }`}
  //               >
  //                 Tümü
  //               </button>
  //               <button
  //                 onClick={() => navigate("/movies/drama")}
  //                 className={`px-3 py-1 rounded-full text-sm ${
  //                   category === "drama"
  //                     ? "bg-blue-500 text-white"
  //                     : "bg-gray-200 text-gray-700"
  //                 }`}
  //               >
  //                 Drama
  //               </button>
  //               <button
  //                 onClick={() => navigate("/movies/thriller")}
  //                 className={`px-3 py-1 rounded-full text-sm ${
  //                   category === "thriller"
  //                     ? "bg-blue-500 text-white"
  //                     : "bg-gray-200 text-gray-700"
  //                 }`}
  //               >
  //                 Gerilim
  //               </button>
  //               <button
  //                 onClick={() => navigate("/movies/scifi")}
  //                 className={`px-3 py-1 rounded-full text-sm ${
  //                   category === "scifi"
  //                     ? "bg-blue-500 text-white"
  //                     : "bg-gray-200 text-gray-700"
  //                 }`}
  //               >
  //                 Bilim Kurgu
  //               </button>
  //               <button
  //                 onClick={() => navigate("/movies/fantasy")}
  //                 className={`px-3 py-1 rounded-full text-sm ${
  //                   category === "fantasy"
  //                     ? "bg-blue-500 text-white"
  //                     : "bg-gray-200 text-gray-700"
  //                 }`}
  //               >
  //                 Fantastik
  //               </button>
  //               <button
  //                 onClick={() => navigate("/movies/action")}
  //                 className={`px-3 py-1 rounded-full text-sm ${
  //                   category === "action"
  //                     ? "bg-blue-500 text-white"
  //                     : "bg-gray-200 text-gray-700"
  //                 }`}
  //               >
  //                 Aksiyon
  //               </button>
  //               <button
  //                 onClick={() => navigate("/movies/trending")}
  //                 className={`px-3 py-1 rounded-full text-sm ${
  //                   category === "trending"
  //                     ? "bg-blue-500 text-white"
  //                     : "bg-gray-200 text-gray-700"
  //                 }`}
  //               >
  //                 Trend
  //               </button>
  //             </div>
  //           </div> */}

  //           {/* Film listesi */}
  //           <div>
  //             <Movies category={category} />
  //           </div>
  //           // <Pagination
  //           //   currentPage={page}
  //           //   totalPages={totalPages}
  //           //   onPageChange={handlePageChange}
  //           // />
  //         </div>
  //       );

  //     case "Suç":
  //       return (
  //         <div className="grid grid-cols-6 sm:grid-cols-3 lg:grid-cols-6 gap-6">
  //           <Movies category="action" />
  //         </div>
  //       );

  //     default:
  //       return (
  //         <div className="bg-white p-6 rounded-lg shadow">
  //           <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
  //           <p>Ana sayfa içeriği burada...</p>
  //         </div>
  //       );
  //   }
  // };

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 bg-slate-600 text-white">
      {/* Sabit çıkış butonu */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onBack}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200"
        >
          Çıkış Yap
        </button>
      </div>

      <div className="flex gap-6">
        <Sidebar title="Menü" onItemClick={handleSidebarClick} />
        <div className="flex-1">
          <h1 className="text-3xl text-center font-bold mb-6">Filmler</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default MovieList;
