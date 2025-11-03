import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieApi } from "../services/movieApi";
import type { IMovie } from "../types/IMovie";
import ThemeToggle from "../components/common/ThemeToggle";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [watchUpdated, setWatchUpdated] = useState(false);

  const handleToggleWatch = async () => {
    if (!movie || watchUpdated) return;
    setWatchUpdated(true);
    setError(null);
    try {
      const watchUpdated = await movieApi.updateMovieWatchStatus(
        movie.id,
        !movie.is_watched
      );
      setMovie(watchUpdated);
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      setError("Durum güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setWatchUpdated(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    let isActive = true;
    setLoading(true);
    movieApi
      .getMovieById(Number(id))
      .then((data) => {
        if (!isActive) return;
        if (!data) {
          setMovie(null);
          setError("Kayıt bulunamadı");
          return;
        }
        // Servisten gelen Movie'yi IMovie şekline dönüştür
        // const mapped: IMovie = {
        //   id: data.id,
        //   title: data.title,
        //   posterPath: (data as any).image,
        //   overview: (data as any).description,
        //   releaseDate: String((data as any).releaseYear ?? ""),
        //   voteAverage: Number((data as any).IMDB_Point ?? 0),
        //   runtime: Number(
        //     String((data as any).duration ?? "").split(" ")[0] || 0
        //   ),
        //   genres: (data as any).types ?? [],
        //   is_watched: (data as any).is_watched ?? false,
        // } as IMovie;
        setMovie(data);
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
    if (movie?.title) {
      document.title = `${movie.title} | MovieApp`;
    } else {
      document.title = "Film Detayı | MovieApp";
    }
  }, [movie?.title]);

  useEffect(() => {
    const description = movie?.overview ?? movie?.title ?? "Film detayı";
    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = String(description);
  }, [movie?.overview, movie?.title]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-80 bg-gray-200 rounded" />
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
            <div className="h-4 bg-gray-200 rounded w-3/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">{error ?? "Kayıt bulunamadı"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 rounded  bg-blue-500  dark:bg-blue-400 text-white hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
        >
          Geri
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 rounded  bg-blue-500  dark:bg-blue-400 text-white hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
        >
          Geri
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6  border-blue-200 dark:border-blue-700 border-2">
          <div>
            <img
              src={
                movie.posterPath ||
                "https://res.cloudinary.com/dklvz02ew/image/upload/v1761658140/no-image-available_es01vr.jpg"
              }
              onError={(e) => {
                // Eğer web linki çalışmazsa varsayılan görseli göster
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://res.cloudinary.com/dklvz02ew/image/upload/v1761658140/no-image-available_es01vr.jpg";
              }}
              alt={movie.title}
              className="w-full h-auto rounded shadow m-4 p-2"
            />
          </div>
          <div className=" md:col-span-2 space-y-4  p-6 m-4">
            <h1 className="dark:text-white text-3xl font-semibold">
              {movie.title}
            </h1>
            {movie.overview && (
              <p className="dark:text-white leading-relaxed">
                {movie.overview}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-800 dark:text-gray-100">
              {movie.releaseDate && <span>Yıl: {movie.releaseDate}</span>}
              {typeof movie.voteAverage === "number" && (
                <span>Puan: {movie.voteAverage}</span>
              )}
              {typeof movie.runtime === "number" && (
                <span>Süre: {movie.runtime} dk</span>
              )}
            </div>

            {movie.genres?.length ? (
              <div className="flex flex-wrap gap-2 ">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-1 rounded border text-xs font-medium bg-blue-500 text-gray-50 dark:bg-blue-800 dark:text-gray-50"
                  >
                    {g}
                  </span>
                ))}
              </div>
            ) : null}
            <button
              onClick={handleToggleWatch}
              className="rounded-3xl text-sm  border-2 border-blue-300 mb-6 px-4 py-2   bg-orange-500  dark:bg-orange-500 text-white hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
            >
              {watchUpdated
                ? "Güncelleniyor..."
                : movie.is_watched
                ? "Bu Filmı İzledim"
                : "Bu Filmı İzlemedim"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
