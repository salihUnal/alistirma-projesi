import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { movieApi } from "../services/movieApi";

type Movie = {
  id: number;
  image: string;
  title: string;
  description: string;
  IMDB_Point: string;
  types: string[];
};

interface MoviesProps {
  category?: string;
  onMovieClick?: (movieId: number) => void;
}

export default function Movies({ category }: MoviesProps) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMovieClick = (movieId: number) => {
    console.log("Film tıklandı:", movieId);
    navigate(`/movie/detail/${movieId}`);
  };

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        let data;
        if (category) {
          // Kategori bazlı API çağrısı
          switch (category) {
            case "Popular":
              data = await movieApi.getPopular();
              break;
            case "top-rated":
              data = await movieApi.getTopRated();
              break;
            // ... diğer case'ler
            default:
              data = await movieApi.getAllMovies();
          }
        } else {
          // Arama yapılıyorsa
          data = query
            ? await movieApi.search(query)
            : await movieApi.getAllMovies();
        }

        if (cancelled) return;
        setMovies(
          data.map((m) => ({
            id: m.id,
            image: m.image,
            title: m.title,
            description: m.description,
            IMDB_Point: m.IMDB_Point,
            types: m.types,
          }))
        );
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
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Film, tür, yönetmen ara..."
        className="w-full md:w-96 rounded border px-3 py-2 mb-4"
        aria-label="Ara"
      />

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="text-gray-600">Sonuç bulunamadı.</p>
      )}

      <div className="grid grid-cols-6 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {" "}
        {!loading &&
          !error &&
          movies.map((movie, index) => (
            <div
              key={`${movie.title}-${index}`}
              onClick={() => handleMovieClick(movie.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleMovieClick(movie.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${movie.title} filmini görüntüle`}
              className="cursor-pointer bg-white rounded-2xl shadow border border-gray-200 overflow-hidden"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/images/Hulk.jpg";
                }}
                loading="lazy"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {movie.title}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    IMDB {movie.IMDB_Point}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {movie.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {movie.types.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
