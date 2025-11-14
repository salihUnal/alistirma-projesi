import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/common/ThemeToggle";

interface BookReadProps {
  onBack: () => void;
}

interface ReadBook {
  id: string | number;
  title: string;
  addedAt?: Date;
  updatedAt?: Date;
}

const STORAGE_KEY = "readBooks";

function BookRead({ onBack }: BookReadProps) {
  const { username, logout } = useAuth();
  const { category } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("Okunmuş Kitaplar");
  const [readBooks, setReadBooks] = useState<ReadBook[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const savedBooks = localStorage.getItem(STORAGE_KEY);
    if (savedBooks) {
      try {
        const parsedBooks = JSON.parse(savedBooks);
        // Date string'lerini Date objesine çevir
        const booksWithDates = parsedBooks.map((book: any) => ({
          ...book,
          addedAt: book.addedAt ? new Date(book.addedAt) : undefined,
          updatedAt: book.updatedAt ? new Date(book.updatedAt) : undefined,
        }));
        setReadBooks(booksWithDates);
      } catch (error) {
        console.error("Kitaplar yüklenirken hata oluştu:", error);
      }
    }
  }, []);

  // Kitaplar değiştiğinde localStorage'a kaydet
  useEffect(() => {
    // Date objelerini string'e çevir (localStorage için)
    const booksToSave = readBooks.map((book) => ({
      ...book,
      addedAt: book.addedAt ? book.addedAt.toISOString() : undefined,
      updatedAt: book.updatedAt ? book.updatedAt.toISOString() : undefined,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(booksToSave));
  }, [readBooks]); // readBooks değiştiğinde çalışır

  useEffect(() => {
    setCurrentPage("Okunmuş Kitaplar");
  }, [category]);

  const handleAddBook = () => {
    const trimedValue = inputValue.trim();

    if (!trimedValue) {
      return;
    }

    const newBook: ReadBook = {
      id: Date.now(),
      title: trimedValue,
      addedAt: new Date(),
    };

    setReadBooks((prevBooks) => [...prevBooks, newBook]);

    setInputValue("");
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
              <div className="flex gap-2 mb-6 items-center justify-center">
                <input
                  // className="w-full px-3 py-1  rounded-lg text-black"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 max-w-md"
                  placeholder="Okuduğun Yeni Kitabı ekle"
                  value={inputValue}
                  type="text"
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <button
                  onClick={handleAddBook}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Ekle
                </button>
              </div>

              {readBooks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Henüz kitap eklenmemiş. Yukarıdaki alandan kitap
                  ekleyebilirsiniz.
                </div>
              ) : (
                <ul className="space-y-2 mt-6 max-w-2xl mx-auto ">
                  {readBooks.map((book) => (
                    <li
                      key={book.id}
                      className="flex justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <span className=" text-gray-800 dark:text-gray-200">
                        {book.title}
                      </span>
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
            Kitaplar
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

export default BookRead;
