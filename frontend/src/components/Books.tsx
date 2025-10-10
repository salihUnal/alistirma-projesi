import React from "react";
import { useEffect, useState } from "react";
import { bookApi } from "../services/bookApi";
import { useNavigate } from "react-router-dom";

type Book = {
  id: number;
  title: string;
  author: string;
  description: string;
  publish_date: number;
  genre: string;
  image: string;
  is_read: boolean;
};

interface BooksProps {
  category?: string;
  onBookClick?: (bookId: number) => void;
}

export default function Books({ category }: BooksProps) {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBookClick = (bookId: number) => {
    navigate(`/book/detail/${bookId}`);
  };

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        let data;
        if (category) {
          data = await bookApi.getBooksByGenre(category);
        } else {
          data = query
            ? await bookApi.search(query)
            : await bookApi.getAllBooks();
        }

        if (cancelled) return;
        setBooks(data);
      } catch (e) {
        if (cancelled) return;
        setError("Veri alınamadı");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [category, query]);

  return (
    <div className="p-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Kitap, yazar, tür ara..."
        className="w-full md:w-96 rounded border-separate border-blue-200 dark:border-blue-700 border-2 px-3 py-2 mb-4 bg-transparent text-black text-font-semibold text-lg dark:bg-gray-800 dark:text-white backdrop-blur-sm dark:bg-transparent placeholder:text-black placeholder:font-normal placeholder:italic placeholder:text-base dark:placeholder:text-gray-400 dark:placeholder:italic"
        aria-label="Ara"
      />

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && books.length === 0 && (
        <p className="text-gray-100 dark:text-gray-400">Sonuç bulunamadı.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {!loading &&
          !error &&
          books.map((book, index) => (
            <div
              key={`${book.title}-${index}`}
              onClick={() => handleBookClick(book.id)}
              className="cursor-pointer flex flex-col h-full rounded-2xl shadow border text-gray-700 bg-white/90 dark:bg-slate-900/70 border-gray-200 dark:border-slate-700 overflow-hidden"
            >
              <img
                src={book.image || "/images/no-image-available.jpeg"}
                alt={book.title}
                className="w-full h-72 object-cover"
                loading="lazy"
              />
              <div className="flex flex-col h-full p-4">
                <h3 className="text-lg text-center font-semibold text-slate-900 dark:text-white mb-2">
                  {book.title}
                </h3>
                <div className="text-sm text-blue-950 dark:text-white mb-3">
                  <p>{book.description}</p>
                </div>
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-gray-50 dark:bg-blue-800 dark:text-gray-50">
                      {book.genre}
                    </span>
                  </div>
                  <div className="text-sm text-blue-950 dark:text-white flex flex-col gap-1">
                    <span className="text-sm font-medium text-center py-1 mb-2 rounded-full whitespace-nowrap leading-none border-2 border-blue-800 text-gray-800 dark:text-gray-100">
                      {book.publish_date}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900 dark:text-gray-300">
                        Yazar:
                      </span>
                      <span className="italic text-blue-700 dark:text-blue-300">
                        {book.author}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
