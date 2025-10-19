import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Books from "../components/Books";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/common/ThemeToggle";
import {
  BOOK_CATEGORIES,
  isBookCategory,
  buildBookUrl,
  LABEL_TO_BOOK_SLUG,
} from "../utils/bookCategories";

interface BookListPageProps {
  onBack: () => void;
}

function BookList({ onBack }: BookListPageProps) {
  const { username } = useAuth();
  const { category } = useParams();
  const [currentPage, setCurrentPage] = useState("Kitaplar");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("BookList useEffect çalışıyor, category:", category);
    setCurrentPage("Kitaplar");
  }, [category]);

  const handleSidebarClick = (label: string) => {
    if (label === "Filmler") {
      navigate("/movies");
      return;
    }

    setCurrentPage("Kitaplar");
    const slug = LABEL_TO_BOOK_SLUG[label] ?? "";
    const targetUrl = buildBookUrl(slug || undefined);
    navigate(targetUrl);

    // const urlMap: Record<string, string> = {
    //   Kitaplar: "/books",
    //   Roman: "/books/Roman",
    //   "Bilim Kurgu Kitap": "/books/Bilim-Kurgu",
    //   Tarih: "/books/Tarih",
    //   "Kisisel-Gelisim": "/books/Kisisel-Gelisim",
    //   Distopya: "/books/Distopya",
    //   Oyku: "/books/Oyku",
    //   "Cocuk-Edebiyati": "/books/Cocuk-Edebiyati",
    //   Otobiyografi: "/books/Otobiyografi",
    //   Mektup: "/books/Mektup",
    //   Macera: "/books/Macera",
    //   Felsefe: "/books/Felsefe",
    //   Gunluk: "/books/Gunluk",
    //   Fantastik: "/books/Fantastik",
    //   Deneme: "/books/Deneme",
    //   Biyografi: "/books/Biyografi",
    //   Ani: "/books/Ani",
    //   Allegori: "/books/Allegori",
    //   Genclik: "/books/Genclik",
    // };

    // const targetUrl = urlMap[label] || "/books";
    // navigate(targetUrl);
  };

  console.log("renderContent çalışıyor, currentPage:", currentPage);
  const renderContent = () => {
    switch (currentPage) {
      case "Kitaplar":
        console.log("Kitaplar case'i çalışıyor");
        return (
          <div className="border-separate border-blue-200 dark:border-blue-700 border-2 bg-white dark:bg-gray-800 p-6 mt-10 rounded-lg shadow">
            <div className="mb-1">
              <h3 className="text-center md:grid-cols-2 text-2xl font-bold italic text-gray-800 dark:text-white mb-3">
                {category ? `📚 ${category} Kitapları` : "📚 Tüm Kitaplar"}
              </h3>
              {/* Filtre butonları */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(buildBookUrl(""))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    !category
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Tümü
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Roman"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Roman"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Roman
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Bilim-Kurgu"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Bilim-Kurgu"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Bilim Kurgu
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Tarih"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Tarih"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Tarih
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Kisisel-Gelisim"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Kisisel-Gelisim"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Kişisel Gelişim
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Distopya"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Distopya"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Distopya
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Oyku"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Oyku"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Öykü
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Cocuk-Edebiyati"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Cocuk-Edebiyati"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Çocuk Edebiyatı
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Otobiyografi"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Otobiyografi"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Otobiyografi
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Mektup"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Mektup"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Mektup
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Macera"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Macera"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Macera
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Felsefe"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Felsefe"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Felsefe
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Gunluk"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Gunluk"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Günlük
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Fantastik"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Fantastik"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Fantastik
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Deneme"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Deneme"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Deneme
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Biyografi"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Biyografi"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Biyografi
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Ani"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Ani"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Anı
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Allegori"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Allegori"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Allegori
                </button>
                <button
                  onClick={() => navigate(buildBookUrl("Genclik"))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === "Genclik"
                      ? "bg-blue-500 text-white font-mono"
                      : "bg-blue-300 text-black font-mono hover:bg-blue-500"
                  }`}
                >
                  Gençlik
                </button>
              </div>
            </div>

            <Books category={category} />
          </div>
        );
      default:
        console.log("Default case çalışıyor");
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
          <Sidebar title="Menü" />
          {/* <Sidebar
            title="Menü"
            items={[
              {
                label: "Kitap listesi",
                children: [
                  { label: "Roman", to: "/books/Roman" },
                  { label: "Bilim Kurgu", to: "/books/Bilim-Kurgu" },
                  { label: "Tarih", to: "/books/Tarih" },
                  { label: "Kişisel Gelişim", to: "/books/Kisisel-Gelisim" },
                  { label: "Distopya", to: "/books/Distopya" },
                  { label: "Öykü", to: "/books/Oyku" },
                  { label: "Çocuk Edebiyatı", to: "/books/Cocuk-Edebiyati" },
                  { label: "Otobiyografi", to: "/books/Otobiyografi" },
                  { label: "Mektup", to: "/books/Mektup" },
                  { label: "Macera", to: "/books/Macera" },
                  { label: "Felsefe", to: "/books/Felsefe" },
                  { label: "Günlük", to: "/books/Gunluk" },
                  { label: "Fantastik", to: "/books/Fantastik" },
                  { label: "Deneme", to: "/books/Deneme" },
                  { label: "Biyografi", to: "/books/Biyografi" },
                  { label: "Anı", to: "/books/Ani" },
                  { label: "Allegori", to: "/books/Allegori" },
                  { label: "Gençlik", to: "/books/Genclik" },
                ],
              },
            ]}
          /> */}
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
