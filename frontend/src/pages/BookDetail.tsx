import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookApi } from "../services/bookApi";

type Book = {
  id: number;
  title: string;
  author: string;
  description: string;
  publish_date: number;
  genre: string;
  image: string;
  Page_Count: number;
  is_read: boolean;
};

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isActive = true;
    setLoading(true);
    bookApi
      .getBookById(Number(id))
      .then((data) => {
        if (!isActive) return;
        if (!data) {
          setBook(null);
          setError("Kitap bulunamadı");
          return;
        }
        setBook(data);
        setError(null);
      })
      .catch((e) => {
        if (!isActive) return;
        setError(e?.message ?? "Bir hata oluştu");
      })
      .finally(() => isActive && setLoading(false));
    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    if (book?.title) {
      document.title = `${book.title} | Kitap Uygulaması`;
    } else {
      document.title = "Kitap Detayı | Kitap Uygulaması";
    }
  }, [book?.title]);

  useEffect(() => {
    const description = book?.description ?? book?.title ?? "Kitap detayı";
    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = String(description);
  }, [book?.description, book?.title]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="p-6">
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error ?? "Kitap bulunamadı"}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
        >
          Geri
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 rounded bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
      >
        Geri
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <img
            src={book.image || "/images/no-image-available.jpeg"}
            onError={(e) => {
              // Eğer web linki çalışmazsa varsayılan görseli göster
              const target = e.target as HTMLImageElement;
              target.src = "/images/no-image-available.jpeg";
            }}
            alt={book.title}
            className="w-full h-auto rounded shadow"
          />
        </div>
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            {book.title}
          </h1>

          {book.description && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {book.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {book.publish_date && <span>Yayın Yılı: {book.publish_date}</span>}
            {book.author && <span>Yazar: {book.author}</span>}
            {book.genre && <span>Tür: {book.genre}</span>}
            <span
              className={`px-2 py-1 rounded text-xs ${
                book.is_read
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}
            >
              {book.is_read ? "Okundu" : "Okunmadı"}
            </span>
          </div>

          {book.genre && (
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded border text-xs">
                {book.genre}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
