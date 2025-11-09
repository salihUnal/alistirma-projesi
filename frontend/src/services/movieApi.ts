import { IMovieApiResponse } from "./movieApiTypes";
import { IMovie } from "../types/IMovie";

const API_BASE_URL = "http://localhost:3001/api";

// type ApiMovie = {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
//   imdb_point: number;
//   types: string[];
//   release_year: number;
//   director: string;
//   duration: string;
//   is_watched: boolean;
// };

function mapApiResponseToIMovie(data: IMovieApiResponse): IMovie {
  return {
    id: data.id,
    title: data.title,
    overview: data.description,
    posterPath: data.image,
    releaseDate: String(data.release_year ?? ""),
    director: data.director,
    voteAverage: data.imdb_point ?? 0,
    genres: data.types ?? [],
    runtime: Number(String(data.duration ?? "").split(" ")[0] || 0),
    is_watched: data.is_watched ?? false,
    Like_Count: data.Like_Count ?? 0,
  };
}

export const movieApi = {
  search: async (q: string): Promise<IMovie[]> => {
    const response = await fetch(
      `${API_BASE_URL}/movies?search=${encodeURIComponent(q)}`
    );
    if (!response.ok) {
      throw new Error("Arama başarısız");
    }
    const rawData: IMovieApiResponse[] = await response.json();
    return rawData.map(mapApiResponseToIMovie);
  },

  getAllMovies: async (): Promise<IMovie[]> => {
    const response = await fetch(`${API_BASE_URL}/movies`);
    if (!response.ok) {
      throw new Error("Filmler yüklenemedi");
    }
    const rawData: IMovieApiResponse[] = await response.json();
    return rawData.map(mapApiResponseToIMovie);
  },

  getMovieById: async (id: number): Promise<IMovie | null> => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Film detayı yüklenemedi");
    }
    const rawData: IMovieApiResponse = await response.json();
    if (!rawData) return null;

    return mapApiResponseToIMovie(rawData);
  },

  getMoviesByType: async (type: string): Promise<IMovie[]> => {
    const response = await fetch(
      `${API_BASE_URL}/movies?type=${encodeURIComponent(type)}`
    );
    if (!response.ok) {
      throw new Error("Tür bazlı filmler yüklenemedi");
    }
    const rawData: IMovieApiResponse[] = await response.json();
    return rawData.map(mapApiResponseToIMovie);
  },

  // Diğer metodlar için mock veriler kullanabilirsiniz
  getPopular: async (): Promise<IMovie[]> => {
    const movies = await movieApi.getAllMovies();
    if (!movies) return [];
    return movies.filter(
      (movie: IMovie) =>
        movie.genres?.includes("Drama") || movie.genres?.includes("Fantastik")
    );
  },
  getTopRated: async (): Promise<IMovie[]> => {
    const movies = await movieApi.getAllMovies();
    if (!movies) return [];
    return movies.filter((movie: IMovie) => movie.voteAverage >= 9.0); // 'imdb_point' -> 'voteAverage'
  },

  getNowPlaying: async (): Promise<IMovie[]> => {
    const movies = await movieApi.getAllMovies();
    if (!movies) return [];
    return movies.filter(
      (movie: IMovie) =>
        movie.genres?.includes("Suç") || movie.genres?.includes("Korku")
    );
  },

  getUpcoming: async (): Promise<IMovie[]> => {
    const movies = await movieApi.getAllMovies();
    return movies.filter(
      (movie: IMovie) =>
        movie.genres?.includes("Fantastik") ||
        movie.genres?.includes("Bilim Kurgu")
    );
  },

  updateMovieWatchStatus: async (
    id: number,
    is_watched: boolean
  ): Promise<IMovie> => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // NOT: Eğer ilerde bu endpoint'i korumalı yaparsanız
        // (örn: sadece giriş yapan kullanıcı güncelleyebilsin),
        // buraya 'Authorization' header'ı eklemeniz gerekecek.
        // 'Authorization': `Bearer ${kullaniciTokeni}`
      },
      body: JSON.stringify({ is_watched: is_watched }),
    });
    if (!response.ok) {
      throw new Error("Film izlenme durumu güncellenemedi");
    }
    const updatedRawData: IMovieApiResponse = await response.json();
    return mapApiResponseToIMovie(updatedRawData);
  },

  toggleMovieLike: async (id: number, liked: boolean): Promise<void> => {
    const method = liked ? "POST" : "DELETE";
    const response = await fetch(`${API_BASE_URL}/movies/${id}/like`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Beğeni durumu güncellenemedi");
    }
  },

  getMovieLikeStatus: async (
    id: number
  ): Promise<{ liked: boolean; count: number }> => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}/like`);
    if (!response.ok) {
      throw new Error("Beğeni durumu alınamadı");
    }
    return response.json();
  },
};
