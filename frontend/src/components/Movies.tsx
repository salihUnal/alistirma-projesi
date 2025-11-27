import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { movieApi } from "../services/movieApi";
import { IMovie } from "../types/IMovie";
import { useDebounce } from "../hooks/useDebounce";

// type Movie = {
//   id: number;
//   image: string;
//   title: string;
//   description: string;
//   IMDB_Point: string;
//   types: string[];
//   director: string;
//   duration: string;
//   release_year: number;
//   is_watched: boolean;
// };

interface MoviesProps {
  category?: string;
  onMovieClick?: (movieId: number) => void;
}

export default function Movies({ category }: MoviesProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate();

  // const handleMovieClick = (movieId: number) => {
  //   navigate(`/movie/detail/${movieId}`);
  // };

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        let data: IMovie[] | null;
        if (category && category !== "Tumu") {
          // Kategori bazlı API çağrısı
          switch (category) {
            case "Popular":
              data = await movieApi.getPopular();
              break;
            case "top-rated":
              data = await movieApi.getTopRated();
              break;
            case "Drama":
              data = await movieApi.getMoviesByType("Drama");
              break;
            case "Gerilim":
              data = await movieApi.getMoviesByType("Gerilim");
              break;
            case "Bilim-Kurgu":
              data = await movieApi.getMoviesByType("Bilim Kurgu");
              break;
            case "Fantastik":
              data = await movieApi.getMoviesByType("Fantastik");
              break;
            case "Aksiyon":
              data = await movieApi.getMoviesByType("Suç");
              break;
            case "Genclik":
              data = await movieApi.getMoviesByType("Gençlik");
              break;
            case "Populer":
              data = await movieApi.getMoviesByType("Popüler");
              break;
            case "Korku":
              data = await movieApi.getMoviesByType("Korku");
              break;
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
        // setMovies(
        //   data.map((m) => ({
        //     id: m.id,
        //     image: m.image,
        //     title: m.title,
        //     description: m.description,
        //     IMDB_Point: m.imdb_point.toString(),
        //     types: m.types,
        //     director: m.director,
        //     duration: m.duration,
        //     release_year: m.release_year,
        //     is_watched: m.is_watched,
        //   }))
        // );
        setMovies(data ?? []);
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
  }, [category, debouncedQuery]);
  return (
    <div className="p-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Film, tür, yönetmen, yıl ara..."
        className="w-full md:w-96 rounded  border-blue-200 dark:border-blue-300 border-2  px-3 py-2 mb-4 bg-transparent text-black text-font-semibold text-lg dark:bg-gray-800 dark:text-white backdrop-blur-sm dark:bg-transparent
         placeholder:text-black placeholder:font-normal placeholder:italic placeholder:text-base dark:placeholder:text-gray-400 dark:placeholder:italic"
        aria-label="Ara"
      />

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="text-gray-100 dark:text-gray-400">Sonuç bulunamadı.</p>
      )}

      {/* <div className="grid grid-cols-6 sm:grid-cols-3 lg:grid-cols-6 gap-6"> */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6 ">
        {!loading &&
          !error &&
          movies.map((movie, index) => (
            // <div
            //   key={`${movie.title}-${index}`}
            //   onClick={() => handleMovieClick(movie.id)}
            //   onKeyDown={(e) => {
            //     if (e.key === "Enter" || e.key === " ") {
            //       e.preventDefault();
            //       handleMovieClick(movie.id);
            //     }
            //   }}
            //   role="button"
            //   tabIndex={0}
            //   aria-label={`${movie.title} filmini görüntüle`}
            //   className="cursor-pointer flex flex-col h-full rounded-2xl shadow border text-gray-700
            //     bg-white/90 dark:bg-slate-900/70
            //     border-gray-200 dark:border-slate-700 overflow-hidden"
            // >
            <Link
              // key için index yerine benzersiz olan movie.id kullanmak daha iyidir
              key={movie.id}
              // 'to' prop'u ile hedef URL'i belirtiyoruz
              to={`/movie/detail/${movie.id}`}
              // Fareyle üzerine gelince tarayıcı tooltip'i göstermesi için
              title={movie.title}
              aria-label={`${movie.title} filmini görüntüle`}
              className="cursor-pointer flex flex-col h-full rounded-2xl shadow border text-gray-700
                         bg-white/90 dark:bg-slate-900/70
                         border-gray-200 dark:border-slate-700 overflow-hidden hover:scale-105 transition-all duration-300"
              // onClick, onKeyDown, role, ve tabIndex prop'larına
              // 'Link' bileşeni kullandığımız için artık gerek yok.
            >
              <img
                src={
                  movie.posterPath ||
                  "https://res.cloudinary.com/dklvz02ew/image/upload/v1761658140/no-image-available_es01vr.jpg"
                }
                alt={movie.title}
                className="w-full h-72  object-cover"
                onError={(e) => {
                  // Eğer web linki çalışmazsa varsayılan görseli göster
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://res.cloudinary.com/dklvz02ew/image/upload/v1761658140/no-image-available_es01vr.jpg";
                }}
                loading="lazy"
              />

              <div className="flex flex-col h-full p-4">
                <div className="flex  items-start  justify-between mb-3 min-h-[56px]">
                  <h3 className="text-lg text-center font-semibold text-slate-900  dark:text-white">
                    {movie.title}
                  </h3>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-orange-400 text-yellow-100 dark:bg-yellow-600 dark:text-gray-100 whitespace-nowrap leading-none">
                      {movie.voteAverage}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-400 text-gray-700 dark:bg-orange-600 dark:text-gray-100 whitespace-nowrap leading-none">
                      {movie.runtime} dk
                    </span>
                  </div>
                </div>

                <div className="text-sm text-blue-950 dark:text-white mb-3">
                  <p>{movie.overview}</p>
                </div>
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-1">
                    {movie.genres?.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center px-1 py-1 rounded-full text-xs font-medium bg-blue-500 text-gray-50 dark:bg-blue-800  dark:text-gray-50"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-blue-950 dark:text-white flex flex-col gap-1">
                    <span className="text-sm font-medium text-center py-1 mb-2 my-3 rounded-full whitespace-nowrap leading-none border-2 border-blue-800 text-gray-800 dark:text-gray-100">
                      {movie.releaseDate}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900 dark:text-gray-300">
                        Yönetmen:
                      </span>
                      <span className="italic text-blue-700 dark:text-blue-300">
                        {movie.director}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
