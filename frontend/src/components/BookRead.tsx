import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BookReadApi } from "../services/bookReadApi";
import type { bookReadApiResponse } from "../services/bookReadApiTypes";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/common/ThemeToggle";
import { useDebounce } from "../hooks/useDebounce";
import BookReadGenres, { bookGenres } from "./BookReadGenres";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      Tümü: "/mybooks",
      Alegori: "/mybooks/Alegori",
      Anı: "/mybooks/Ani",
      Akademik: "/mybooks/Akademik",
      Antoloji: "/mybooks/Antoloji",
      "Araştırma - İnceleme": "/mybooks/Arastirma-inceleme",
      Bilim: "/mybooks/Bilim",
      "Bilim Kurgu": "/mybooks/Bilim-Kurgu",
      Biyografi: "/mybooks/Biyografi",
      "Çizgi Roman": "/mybooks/Cizgi-Roman",
      "Çocuk Edebiyatı": "/mybooks/Çocuk Edebiyatı",
      Deneme: "/mybooks/Deneme",
      "Din ve Mitoloji": "/mybooks/Din-Mitoloji",
      Distopya: "/mybooks/Distopya",
      Edebiyat: "/mybooks/Edebiyat",
      "Eğitim / Akademik": "/mybooks/Egitim-Akademik",
      Ekonomi: "/mybooks/Ekonomi",
      Fantastik: "/mybooks/Fantastik",
      Felsefe: "/mybooks/Felsefe",
      Gezi: "/mybooks/Gezi",
      Gençlik: "/mybooks/Genclik",
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
            // Tümü: "",
            Alegori: "Alegori",
            Ani: "Anı",
            Akademik: "Akademik",
            Antoloji: "Antoloji",
            "Arastirma-inceleme": "Araştırma - İnceleme",
            Bilim: "Bilim",
            "Bilim-Kurgu": "Bilim Kurgu",
            Biyografi: "Biyografi",
            "Cizgi-Roman-Manga": "Çizgi Roman",
            "Cocuk-Edebiyati": "Çocuk Edebiyatı",
            Deneme: "Deneme",
            "Din-Mitoloji": "Din ve Mitoloji",
            Distopya: "Distopya",
            Edebiyat: "Edebiyat",
            Egitim: "Eğitim",
            Ekonomi: "Ekonomi",
            Fantastik: "Fantastik",
            Felsefe: "Felsefe",
            Gezi: "Gezi",
            Gençlik: "Gençlik",
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
          <div className="border border-slate-400 dark:border-slate-700 bg-white dark:bg-gray-800 p-6 mt-10 rounded-lg shadow">
            <div className="mb-1">
              {/* <h3 className="text-center md:grid-cols-2 text-2xl font-bold italic text-gray-800 dark:text-white mb-3">
                🎧📓 Okuduğum Kitaplarımın Listesi
              </h3> */}
              {/* <div className=" flex items-center justify-center text-center text-2xl font-bold italic text-gray-800 dark:text-white mb-3">
                <span>🎧📓 Okuduğum Kitaplarımın Listesi</span>
              </div> */}
              <div className="mb-6">
                <h3 className="text-center md:grid-cols-0 text-2xl font-bold italic text-gray-800 dark:text-white mb-6 truncate">
                  {category
                    ? `📖  Okunmuş ${category} Kitapları`
                    : "🎧📖  Tüm Okunmuş Kitaplar"}
                </h3>

                {/* Filtre butonları - DİNAMİK LİSTELEME */}
                <div
                  className="cursor-pointer flex gap-2 overflow-x-auto whitespace-nowrap pb-2 
  {/* Webkit (Chrome, Safari, Edge) Ayarları */}
  hover:[&::-webkit-scrollbar-thumb]:bg-blue-100
  [&::-webkit-scrollbar]:h-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-blue-400
  [&::-webkit-scrollbar-thumb]:rounded-full
    dark:[&::-webkit-scrollbar-track]:bg-slate-700
  dark:[&::-webkit-scrollbar-thumb]:bg-blue-600"
                >
                  {/* 'Tümü' Butonu (Sabit Kalacak) */}
                  <button
                    onClick={() => navigate("/mybooks")}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      !category
                        ? "bg-blue-500 text-white font-mono"
                        : "bg-blue-100 dark:bg-blue-900 text-black dark:text-white font-mono hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    Tümü
                  </button>

                  {/* Dinamik Genre Butonları */}
                  {bookGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => navigate(`/mybooks/${genre}`)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        category === genre
                          ? "bg-blue-500 text-white font-mono"
                          : "bg-blue-100 dark:bg-blue-900 text-black dark:text-white font-mono hover:bg-blue-500 hover:text-white"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              {/* Arama Input'u */}
              <div className="flex gap-2 mb-4 items-center justify-center">
                <input
                  className="flex-1 px-3 py-2 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 max-w-xs"
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
              <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row gap-2 lg:flex-col-row mb-6 items-center justify-center ">
                <input
                  className="flex-1 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 sm:max-w-full md:max-w-56"
                  placeholder="Okuduğun Yeni Kitabı ekle"
                  value={inputValueBook}
                  type="text"
                  onChange={(e) => setInputValueBook(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading || isAdding}
                />
                <input
                  className="flex-1 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 sm:max-w-full md:max-w-60"
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
                  className="flex-1 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 max-w-52 cursor-pointer   
                  {/* Webkit (Chrome, Safari, Edge) Ayarları */}
  [&::-webkit-scrollbar]:w-2
  hover:[&::-webkit-scrollbar-thumb]:bg-blue-500
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-blue-400
  [&::-webkit-scrollbar-thumb]:rounded-lg
    dark:[&::-webkit-scrollbar-track]:bg-slate-700
  dark:[&::-webkit-scrollbar-thumb]:bg-blue-600"
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
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 truncate">
                          {book.Book_Name}
                        </h3>

                        {/* Yazar */}
                        <div className="text-sm text-blue-950 dark:text-white mb-3">
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="font-semibold text-gray-900 dark:text-gray-300 shrink-0">
                              Yazar:
                            </span>
                            <span className="italic text-blue-700 dark:text-blue-300 truncate">
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
      <div className="flex flex-1 items-center justify-between px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200/60 dark:border-slate-700/60 rounded-lg">
        <Link to="/mybooks/" className="flex flex-1 min-w-0 items-center gap-3">
          <img
            src="https://res.cloudinary.com/dklvz02ew/image/upload/v1761658139/kitap-logo_acpjzd.png"
            alt="Uygulama Logosu"
            className="w-12 h-12 shrink-0 "
            // role="button"
            // onClick={() => navigate("/books/Tumu")}
          />
          <span className="text-lg font-semibold sm:text-lg md:text-md lg:text-lg xl:text-xl 2xl:text-2xl text-slate-800 dark:text-slate-100 truncate ">
            Okuduğum Kitaplar Listesi
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-slate-800 dark:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            aria-label="Menüyü Aç/Kapat"
          >
            {/* Hamburger (Açık değilse) veya X (Açıksa) ikonu */}
            {isSidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
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
      <div className="mt-4 flex flex-col md:flex-row gap-4 items-start max-w-full">
        {/* 1. Sidebar Bölümü (Solda Sabit) */}
        <div
          className={`
            shrink-0 
            ${
              isSidebarOpen
                ? "fixed inset-y-0 left-0 z-50 w-64 shadow-2xl bg-white dark:bg-slate-900 transition-transform duration-300 ease-in-out" // Mobil Açık
                : "hidden" // Mobil Kapalı
            } 
            md:block md:w-64 md:static md:shadow-none md:transform-none md:bg-transparent // Desktop (Daima Görünür ve Sabit Yerinde)
          `}
        >
          <Sidebar title="Menü" onItemClick={() => setIsSidebarOpen(false)} />
        </div>

        {/* Mobil Arka Plan Karartma (Overlay) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <div className="flex-1 w-full min-w-0">
          {/* <h1 className="text-3xl text-center font-bold sm:block mb-6 text-gray-900 dark:text-white">
            Okunmuş Kitaplar
          </h1> */}
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
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 sm:max-w-full md:max-w-60 cursor-pointer
                {/* Webkit (Chrome, Safari, Edge) Ayarları */}
  [&::-webkit-scrollbar]:w-2
  hover:[&::-webkit-scrollbar-thumb]:bg-blue-500
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-blue-400
  [&::-webkit-scrollbar-thumb]:rounded-lg
    dark:[&::-webkit-scrollbar-track]:bg-slate-700
  dark:[&::-webkit-scrollbar-thumb]:bg-blue-600"
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
