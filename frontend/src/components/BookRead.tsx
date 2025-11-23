import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BookReadApi } from "../services/bookReadApi";
import type { bookReadApiResponse } from "../services/bookReadApiTypes";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/common/ThemeToggle";
import { useDebounce } from "../hooks/useDebounce";
import BookReadGenres from "./BookReadGenres";
import LikeButton from "./common/LikeButton";

interface BookReadProps {
  onBack: () => void;
}

function BookRead({ onBack }: BookReadProps) {
  const { username, logout } = useAuth();
  const { category, page: urlPage } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("Okunmuş Kitaplar");
  const [page, setPage] = useState(1);
  const [readBooks, setReadBooks] = useState<bookReadApiResponse[]>([]);
  // const [book, setBook] = useState<bookReadApiResponse | null>(null);
  const [inputValueBook, setInputValueBook] = useState("");
  const [inputValueAuthor, setInputValueAuthor] = useState("");
  const [inputValueGenre, setInputValueGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [editingBook, setEditingBook] = useState<bookReadApiResponse | null>(
    null
  );
  const [editBookName, setEditBookName] = useState("");
  const [editAuthorName, setEditAuthorName] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const isFormValid =
    inputValueBook.trim() && inputValueAuthor.trim() && inputValueGenre.trim();

  useEffect(() => {
    if (urlPage) {
      setPage(parseInt(urlPage));
    }
  }, [urlPage]);

  useEffect(() => {
    // “/movies” veya “/movies/:category” her durumda Film görünümü
    setCurrentPage("Okuduğum Kitaplar");
  }, [category]);

  const handleSidebarClick = (label: string) => {
    setCurrentPage(label);

    // Sidebar butonlarına göre URL değiştir
    const urlMap: Record<string, string> = {
      Kitaplar: "/mybooks",
      Alegori: "/mybooks/Alegori",
      Anı: "/mybooks/Ani",
      Akademik: "/mybooks/Akademik",
      Antoloji: "/mybooks/Antoloji",
      "Araştırma - İnceleme": "/mybooks/Arastirma-inceleme",
      Bilim: "/mybooks/Bilim",
      "Bilim Kurgu": "/mybooks/Bilim-Kurgu",
      Biyografi: "/mybooks/Biyografi",
      "Çizgi Roman / Manga": "/mybooks/Cizgi-Roman-Manga",
      "Çocuk Edebiyatı": "/mybooks/Çocuk Edebiyatı",
      Deneme: "/mybooks/Deneme",
      "Din ve Mitoloji": "/mybooks/Din-Mitoloji",
      Distopya: "/mybooks/Distopya",
      Edebiyat: "/mybooks/Edebiyat",
      "Eğitim / Akademik": "/mybooks/Egitim-Akademik",
      Ekonomi: "/mybooks/Ekonomi",
      Fantastik: "/mybooks/Fantastik",
      Felsefe: "/mybooks/Felsefe",
      "Gezi / Seyahat": "/mybooks/Gezi-Seyahat",
      "Genç Yetişkin": "/mybooks/Genc-Yetiskin",
      Gerilim: "/mybooks/Gerilim",
      Günlük: "/mybooks/Gunluk",
      "Hikaye (Öykü)": "/mybooks/Hikaye",
      Hobi: "/mybooks/Hobi",
      "Kişisel Gelişim": "/mybooks/Kisisel-Gelisim",
      Klasikler: "/mybooks/Klasikler",
      Korku: "/mybooks/Korku",
      Macera: "/mybooks/Macera",
      Mektup: "/mybooks/Mektup",
      Mizah: "/mybooks/Mizah",
      Otobiyografi: "/mybooks/Otobiyografi",
      Polisiye: "/mybooks/Polisiye",
      Psikoloji: "/mybooks/Psikoloji",
      Referans: "/mybooks/Referans",
      Roman: "/mybooks/Roman",
      Sağlık: "/mybooks/Saglık",
      Sanat: "/mybooks/Sanat",
      Siyaset: "/mybooks/Siyaset",
      Sosyoloji: "/mybooks/Sosyoloji",
      Şiir: "/mybooks/Siir",
      Tarih: "/mybooks/Tarih",
      "Tarihi Kurgu": "/mybooks/Tarihi-Kurgu",
      Tiyatro: "/mybooks/Tiyatro",
      Diğer: "/mybooks/Diger",
    };

    const targetUrl = urlMap[label] || "/mybooks";
    navigate(targetUrl);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        let books;
        if (debouncedSearchQuery.trim()) {
          books = await BookReadApi.search(debouncedSearchQuery.trim());
        } else {
          books = await BookReadApi.getAllReadBook();
        }

        // Category'ye göre filtreleme
        if (category && category !== "Tumu") {
          // URL'deki category slug'ını genre değerine çevir
          const categoryMap: Record<string, string> = {
            Alegori: "Alegori",
            Ani: "Anı",
            Akademik: "Akademik",
            Antoloji: "Antoloji",
            "Arastirma-inceleme": "Araştırma - İnceleme",
            Bilim: "Bilim",
            "Bilim-Kurgu": "Bilim Kurgu",
            Biyografi: "Biyografi",
            "Cizgi-Roman-Manga": "Çizgi Roman / Manga",
            "Cocuk-Edebiyati": "Çocuk Edebiyatı",
            Deneme: "Deneme",
            "Din-Mitoloji": "Din ve Mitoloji",
            Distopya: "Distopya",
            Edebiyat: "Edebiyat",
            "Egitim-Akademik": "Eğitim / Akademik",
            Ekonomi: "Ekonomi",
            Fantastik: "Fantastik",
            Felsefe: "Felsefe",
            "Gezi-Seyahat": "Gezi / Seyahat",
            "Genc-Yetiskin": "Genç Yetişkin",
            Gerilim: "Gerilim",
            Gunluk: "Günlük",
            Hikaye: "Hikaye (Öykü)",
            Hobi: "Hobi",
            "Kisisel-Gelisim": "Kişisel Gelişim",
            Klasikler: "Klasikler",
            Korku: "Korku",
            Macera: "Macera",
            Mektup: "Mektup",
            Mizah: "Mizah",
            Otobiyografi: "Otobiyografi",
            Polisiye: "Polisiye",
            Psikoloji: "Psikoloji",
            Referans: "Referans",
            Roman: "Roman",
            Saglik: "Sağlık",
            Sanat: "Sanat",
            Siyaset: "Siyaset",
            Sosyoloji: "Sosyoloji",
            Siir: "Şiir",
            Tarih: "Tarih",
            "Tarihi-Kurgu": "Tarihi Kurgu",
            Tiyatro: "Tiyatro",
            Diger: "Diğer",
          };

          const genreFilter = categoryMap[category] || category;
          books = books.filter((book) => book.Genre === genreFilter);
        }

        setReadBooks(books);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Kitaplar Yüklenirken Hata Oluştu"
        );
        console.error("Kitaplar Yüklenirken Hata", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [debouncedSearchQuery, category]);

  useEffect(() => {
    setCurrentPage("Okunmuş Kitaplar");
  }, [category]);

  const handleAddBook = async () => {
    const trimedValueAuthor = inputValueAuthor.trim();
    const trimedValueBook = inputValueBook.trim();
    const trimedValueGenre = inputValueGenre.trim();

    if (!trimedValueBook) {
      return;
    }
    if (!trimedValueAuthor) {
      return;
    }

    setIsAdding(true);
    setLoading(true);
    setError(null);
    try {
      const newBook = await BookReadApi.addBookRead({
        Book_Name: trimedValueBook,
        Completed: true,
        Author_Name: trimedValueAuthor || "Bilinmiyor",
        Genre: trimedValueGenre,
        User_Id: 1, // Şimdilik default, daha sonra AuthContext'ten alabilirsiniz
      });

      setReadBooks((prevBooks) => [newBook, ...prevBooks]);

      setInputValueAuthor("");
      setInputValueBook("");
      setInputValueGenre("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kitap Eklenirken Hata Oluştu"
      );
      console.error("Kitap Eklenirken Hata Oluştu", err);
    } finally {
      setLoading(false);
      setIsAdding(false);
    }
  };

  const handleDeleteBook = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await BookReadApi.deletedBookRead(id);
      // Başarılı olursa state'ten kaldır
      setReadBooks((prevBooks) => prevBooks.filter((book) => book.Id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kitap silinirken hata oluştu"
      );
      console.error("Kitap silinirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = async (book: bookReadApiResponse) => {
    setEditingBook(book);
    setEditBookName(book.Book_Name);
    setEditAuthorName(book.Author_Name || "");
    setEditGenre(book.Genre);
  };

  const handleSaveEditBook = async () => {
    if (!editingBook) return;
    const trimmedBookName = editBookName.trim();
    const trimmedAuthorName = editAuthorName.trim();
    const trimmedGenre = editGenre.trim();
    if (!trimmedBookName || !trimmedAuthorName) {
      setError("Kitap adı ve yazar adı boş olamaz");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedBook = await BookReadApi.updateBookRead(editingBook.Id, {
        Book_Name: trimmedBookName,
        Author_Name: trimmedAuthorName,
        Genre: trimmedGenre,
      });
      setReadBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.Id === editingBook.Id ? updatedBook : book
        )
      );
      setEditingBook(null);
      setEditBookName("");
      setEditAuthorName("");
      setEditGenre("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kitap güncellenirken hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddBook();
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "Okunmuş Kitaplar":
        return (
          <div className="border-separate border-blue-200 dark:border-blue-700 border-2 bg-white dark:bg-gray-800 p-6 mt-10 rounded-lg shadow">
            <div className="mb-1">
              {/* <h3 className="text-center md:grid-cols-2 text-2xl font-bold italic text-gray-800 dark:text-white mb-3">
                🎧📓 Okuduğum Kitaplarımın Listesi
              </h3> */}
              {/* <div className=" flex items-center justify-center text-center text-2xl font-bold italic text-gray-800 dark:text-white mb-3">
                <span>🎧📓 Okuduğum Kitaplarımın Listesi</span>
              </div> */}
              <div className="mb-6">
                <h3 className=" text-center md:grid-cols-2 text-2xl font-bold italic text-gray-800 dark:text-white mb-6">
                  {category
                    ? `🎬 ${category} Okunmuş Kitaplar`
                    : "🎧📓  Tüm Okunmuş Kitaplar"}
                  {""}
                </h3>
                {/* Filtre butonları */}

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate("/mybooks")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      !category
                        ? "bg-blue-500 text-white font-mono "
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Tümü
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Alegori")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Alegori"
                        ? "bg-blue-500 text-white font-mono "
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Alegori
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Ani")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Anı"
                        ? "bg-blue-500 text-white font-mono "
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Anı
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Akademik")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Akademik"
                        ? "bg-blue-500 text-white font-mono "
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Akademik
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Antoloji")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Antoloji"
                        ? "bg-blue-500 text-white font-mono "
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Antoloji
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Arastirma-inceleme")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Araştırma - İnceleme"
                        ? "bg-blue-500 text-white font-mono "
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Araştırma - İnceleme
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Bilim")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Bilim"
                        ? "bg-blue-500 text-white font-mono "
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Bilim
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Bilim-Kurgu")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Bilim-Kurgu"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Bilim Kurgu
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Biyografi")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Biyografi"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Biyografi
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Cizgi-Roman-Manga")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Çizgi Roman / Manga"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Çizgi Roman / Manga
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Cocuk-Edebiyati")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Çocuk Edebiyatı"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Çocuk Edebiyatı
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Deneme")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Deneme"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Deneme
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Din-Mitoloji")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Din ve Mitoloji"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Din ve Mitoloji
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Distopya")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Distopya"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Distopya
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Edebiyat")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Edebiyat"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Edebiyat
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Egitim-Akademik")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Eğitim / Akademik:"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Eğitim / Akademik:
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Ekonomi")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Ekonomi"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Ekonomi
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Fantastik")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Fantastik"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Fantastik
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Felsefe")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Felsefe"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Felsefe
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Gezi-Seyahat")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Gezi / Seyahat"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Gezi / Seyahat
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Genç-Yetiskin")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Genç Yetişkin"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Genç Yetişkin
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Gerilim")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Gerilim"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Gerilim
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Gunluk")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Günlük"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Günlük
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Hikaye")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Hikaye (Öykü)"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Hikaye
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Hobi")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Hobi"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Hobi
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Kisisel-Gelisim")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Kişisel Gelişim"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Kişisel Gelişim
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Klasikler")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Klasikler"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Klasikler
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Korku")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Korku"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Korku
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Macera")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Macera"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Macera
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Mektup")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Mektup"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Mektup
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Mizah")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Mizah"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Mizah
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Otobiyografi")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Otobiyografi"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Otobiyografi
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Polisiye")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Polisiye"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Polisiye
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Psikoloji")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Psikoloji"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Psikoloji
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Referans")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Referans"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Referans
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Roman")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Roman"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Roman
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Saglik")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Sağlık"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Sağlık
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Sanat")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Sanat"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Sanat
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Siyaset")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Siyaset"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Siyaset
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Sosyoloji")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Sosyoloji"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Sosyoloji
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Siir")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Şiir"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Şiir
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Tarih")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Tarih"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Tarih
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Tarihi-Kurgu")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Tarihi Kurgu"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Tarihi Kurgu
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Tiyatro")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Tiyatro"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Tiyatro
                  </button>
                  <button
                    onClick={() => navigate("/mybooks/Diger")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      category === "Diğer"
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-300 text-black font-mono  hover:bg-blue-500"
                    }`}
                  >
                    Diğer
                  </button>
                </div>
              </div>
              {/* Arama Input'u */}
              <div className="flex gap-2 mb-4 items-center justify-center">
                <input
                  className="flex-1 px-3 py-2 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 max-w-md"
                  placeholder="Kitap ara (kitap adı veya yazar)..."
                  value={searchQuery}
                  type="text"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Error ve Loading Mesajları */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-center">
                  {error}
                </div>
              )}

              {loading && (
                <div className="mb-4 p-3 text-center text-gray-500 dark:text-gray-400">
                  Yükleniyor...
                </div>
              )}

              {/* Kitap Ekleme Input'u */}
              <div className="flex gap-2 mb-6 items-center justify-center ">
                <input
                  className="flex-1 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 max-w-60"
                  placeholder="Okuduğun Yeni Kitabı ekle"
                  value={inputValueBook}
                  type="text"
                  onChange={(e) => setInputValueBook(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading || isAdding}
                />
                <input
                  className="flex-1 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 max-w-60"
                  placeholder="Okuduğun Yeni Kitabın Yazarı"
                  value={inputValueAuthor}
                  type="text"
                  onChange={(e) => setInputValueAuthor(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading || isAdding}
                />
                {/* <input
                  className="flex-1 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 max-w-60"
                  placeholder="Okuduğun Yeni Kitabın Türü"
                  value={inputValueGenre}
                  type="text"
                  onChange={(e) => setInputValueGenre(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading || isAdding}
                /> */}
                <BookReadGenres
                  value={inputValueGenre}
                  onChange={(e) => setInputValueGenre(e.target.value)}
                  disabled={loading || isAdding}
                  // Senin inputlarındaki stilin aynısını buraya className olarak veriyoruz:
                  className="flex-1 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 max-w-60 cursor-pointer"
                />
                <button
                  onClick={handleAddBook}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || isAdding || !isFormValid}
                >
                  {isAdding ? "Ekleniyor..." : ""}
                  ⌯⌲
                  {isAdding && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      {new Date().toLocaleTimeString("tr-TR")}
                    </span>
                  )}
                </button>
              </div>

              {readBooks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Henüz kitap eklenmemiş. Yukarıdaki alandan kitap
                  ekleyebilirsiniz.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-6">
                  {readBooks.map((book, index) => (
                    <div
                      key={book.Id || `book-${index}`}
                      onClick={() => handleEditBook(book)}
                      className="cursor-pointer flex flex-col h-full rounded-2xl shadow border text-gray-700 bg-white/90 dark:bg-slate-900/70 border-gray-200 dark:border-slate-700 overflow-hidden hover:scale-105 transition-all duration-300"
                    >
                      {/* <span className="text-center font-semibold text-slate-900  dark:text-white w-full">
                        {book.Book_Name}
                        {book.Author_Name && (
                          <span className="text-sm font-light italic text-slate-900  dark:text-white ml-2">
                            - {book.Author_Name}
                          </span>
                        )}
                        <span className=" bottom-0 left-0 m-1 text-xs opacity-70 px-3 pb-1 bg-slate-200/50 rounded-3xl border border-slate-900/50 border-b-3 border-r-3 dark:border-slate-200/50 dark:bg-slate-900/50 font-light italic text-slate-900  dark:text-white ml-2">
                          {new Date(book.Updated_At).toLocaleString("tr-TR")}
                        </span>
                        <span className=" top-0 left-0 m-1 text-xs opacity-70 px-3 pb-1 bg-slate-200/50 rounded-3xl border border-slate-900/50 border-b-3 border-r-3 dark:border-slate-200/50 dark:bg-slate-900/50 font-light italic text-slate-900  dark:text-white ml-2">
                          {book.Genre || "Bilinmiyor"}
                        </span>
                      </span> */}
                      <div className="flex flex-col h-full p-4">
                        {/* Kitap Adı */}
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          {book.Book_Name}
                        </h3>

                        {/* Yazar */}
                        <div className="text-sm text-blue-950 dark:text-white mb-3">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-gray-900 dark:text-gray-300">
                              Yazar:
                            </span>
                            <span className="italic text-blue-700 dark:text-blue-300">
                              {book.Author_Name || "Bilinmiyor"}
                            </span>
                          </div>
                        </div>
                        {/* Alt Kısım - Genre, Tarih ve Butonlar */}
                        <div className="mt-auto">
                          {/* Genre Badge */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-gray-50 dark:bg-blue-800 dark:text-gray-50">
                              {book.Genre || "Bilinmiyor"}
                            </span>
                          </div>
                          <div className="text-sm text-blue-950 dark:text-white mb-3">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {new Date(book.Updated_At).toLocaleString(
                                "tr-TR"
                              )}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditBook(book);
                              }}
                              className="px-2 py-1 bg-green-500 hover:bg-green-700 text-white rounded-full  transition-colors"
                              disabled={loading}
                            >
                              𓂃🖊
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setBookToDelete(book.Id);
                              }}
                              className="px-2 py-1 bg-red-500 hover:bg-red-700 text-white rounded-3xl  transition-colors"
                              disabled={loading}
                            >
                              🗑
                            </button>
                            <LikeButton
                              initialLiked={book.Is_liked || false}
                              initialCount={book.Like_Count || 0}
                              onToggleLike={async (nextLiked) => {
                                if (!book) return;

                                await BookReadApi.toggleBookLike(
                                  book.Id,
                                  nextLiked
                                );

                                // Array içindeki kitabı güncelle
                                setReadBooks((prevBooks) =>
                                  prevBooks.map((b) =>
                                    b.Id === book.Id
                                      ? {
                                          ...b,
                                          Is_liked: nextLiked,
                                          Like_Count:
                                            (b.Like_Count || 0) +
                                            (nextLiked ? 1 : -1),
                                        }
                                      : b
                                  )
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen px-4 py-8 dark:bg-slate-900 text-white">
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200/60 dark:border-slate-700/60 rounded-lg">
        <Link to="/mybooks/" className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dklvz02ew/image/upload/v1761658139/kitap-logo_acpjzd.png"
            alt="Uygulama Logosu"
            className="w-12 h-12 shrink-0 "
            // role="button"
            // onClick={() => navigate("/books/Tumu")}
          />
          <span className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Okuduğum Kitaplar Listesi
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
            Okunmuş Kitaplar
          </h1>
          {renderContent()}
        </div>
      </div>
      {bookToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Silme Onayı
            </h4>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Bu kitabı silmek istediğinize emin misiniz? Bu işlem geri
              alınamaz.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setBookToDelete(null)} // Modalı kapat
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400"
                disabled={loading}
              >
                İptal
              </button>
              <button
                onClick={async () => {
                  if (bookToDelete === null) return;
                  await handleDeleteBook(bookToDelete); // Silme işlemini çalıştır
                  setBookToDelete(null); // Modalı kapat
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                disabled={loading}
              >
                {loading ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
      {editingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Kitabı Düzenle
            </h4>
            <div className="space-y-4 mb-6">
              <label
                htmlFor="editBookName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Kitap Adı
              </label>
              <input
                type="text"
                placeholder="Kitap Adı"
                value={editBookName}
                onChange={(e) => setEditBookName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="editAuthorName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Yazar Adı
              </label>

              <input
                type="text"
                placeholder="Yazar Adı"
                value={editAuthorName}
                onChange={(e) => setEditAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label
                htmlFor="editGenre"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tür
              </label>
              {/* <input
                type="text"
                placeholder="Tür"
                value={editGenre}
                onChange={(e) => setEditGenre(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              /> */}
              <BookReadGenres
                value={editGenre}
                onChange={(e) => setEditGenre(e.target.value)}
                // Edit modalındaki input stiline uygun className:
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setEditingBook(null);
                  setEditBookName("");
                  setEditAuthorName("");
                  setEditGenre("");
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400"
                disabled={loading}
              >
                İptal
              </button>
              <button
                onClick={handleSaveEditBook}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                disabled={loading}
              >
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
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

export default BookRead;
