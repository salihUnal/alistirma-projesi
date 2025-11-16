import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BookReadApi } from "../services/bookReadApi";
import type { bookReadApiResponse } from "../services/bookReadApiTypes";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/common/ThemeToggle";
import { useDebounce } from "../hooks/useDebounce";

interface BookReadProps {
  onBack: () => void;
}

function BookRead({ onBack }: BookReadProps) {
  const { username, logout } = useAuth();
  const { category } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("Okunmuş Kitaplar");
  const [readBooks, setReadBooks] = useState<bookReadApiResponse[]>([]);
  const [inputValueB, setInputValueB] = useState("");
  const [inputValueA, setInputValueA] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);

  // useEffect(() => {
  //   const savedBooks = localStorage.getItem(STORAGE_KEY);
  //   if (savedBooks) {
  //     try {
  //       const parsedBooks = JSON.parse(savedBooks);
  //       // Date string'lerini Date objesine çevir
  //       const booksWithDates = parsedBooks.map((book: any) => ({
  //         ...book,
  //         Creation_At: book.Creation_At
  //           ? new Date(book.Creation_At)
  //           : undefined,
  //         Updated_At: book.Updated_At ? new Date(book.Updated_At) : undefined,
  //       }));
  //       setReadBooks(booksWithDates);
  //     } catch (error) {
  //       console.error("Kitaplar yüklenirken hata oluştu:", error);
  //     }
  //   }
  // }, []);

  // // Kitaplar değiştiğinde localStorage'a kaydet
  // useEffect(() => {
  //   // Date objelerini string'e çevir (localStorage için)
  //   const booksToSave = readBooks.map((book) => ({
  //     ...book,
  //     addedAt: book.Creation_At ? book.Creation_At.toISOString() : undefined,
  //     updatedAt: book.Updated_At ? book.Updated_At.toISOString() : undefined,
  //   }));
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(booksToSave));
  // }, [readBooks]); // readBooks değiştiğinde çalışır

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
  }, [debouncedSearchQuery]);

  useEffect(() => {
    setCurrentPage("Okunmuş Kitaplar");
  }, [category]);

  const handleAddBook = async () => {
    const trimedValueB = inputValueB.trim();
    const trimedValueA = inputValueA.trim();

    if (!trimedValueB) {
      return;
    }
    if (!trimedValueA) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newBook = await BookReadApi.addBookRead({
        Book_Name: trimedValueB,
        Completed: true,
        Author_Name: trimedValueA || "Bilinmiyor", //şimdlikl defaoult yazar için ayrı bir input ekle
        User_Id: 1, // Şimdilik default, daha sonra AuthContext'ten alabilirsiniz
      });

      setReadBooks((prevBooks) => [newBook, ...prevBooks]);

      setInputValueB("");
      setInputValueA("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kitap Eklenirken Hata Oluştu"
      );
      console.error("Kitap Eklenirken Hata Oluştu", err);
    } finally {
      setLoading(false);
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

  const handleEditBook = async (id: number) => {
    setLoading(true);
    setError(null);
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
              <h3 className="text-center md:grid-cols-2 text-2xl font-bold italic text-gray-800 dark:text-white mb-3">
                🎧📓 Okuduğum Kitaplarım alt
              </h3>

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
                  value={inputValueB}
                  type="text"
                  onChange={(e) => setInputValueB(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <input
                  className="flex-1 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 max-w-60"
                  placeholder="Okuduğun Yeni Kitabın Yazarı"
                  value={inputValueA}
                  type="text"
                  onChange={(e) => setInputValueA(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleAddBook}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  disabled={loading}
                >
                  ⌯⌲
                </button>
              </div>

              {readBooks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Henüz kitap eklenmemiş. Yukarıdaki alandan kitap
                  ekleyebilirsiniz.
                </div>
              ) : (
                <ul className="space-y-2 mt-6 max-w-2xl mx-auto  ">
                  {readBooks.map((book) => (
                    <li
                      key={book.Id}
                      className="cursor-pointer  shadow text-gray-700 flex justify-between items-center p-3  bg-white/90 dark:bg-slate-900/70 rounded-3xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:scale-105 transition-all duration-300"
                    >
                      <span className="text-center font-semibold text-slate-900  dark:text-white w-full">
                        {book.Book_Name}
                        {book.Author_Name && (
                          <span className="text-sm font-light italic text-slate-900  dark:text-white ml-2">
                            - {book.Author_Name}
                          </span>
                        )}
                      </span>
                      <div className="flex flex-wrap gap-2  ">
                        <button
                          // onClick={() => handleEditBook(book.Id)}
                          className="px-2 py-1 bg-green-500 hover:bg-green-700 text-white rounded-3xl  transition-colors"
                          disabled={loading}
                        >
                          𓂃🖊
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.Id)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-700 text-white rounded-3xl  transition-colors"
                          disabled={loading}
                        >
                          🗑
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen px-4 py-8 dark:bg-slate-900 text-white">
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200/60 dark:border-slate-700/60 rounded-lg">
        <Link to="/books/" className="flex items-center gap-3">
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
