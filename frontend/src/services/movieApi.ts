const API_BASE_URL = "http://localhost:3001/api";

type ApiMovie = {
  id: number;
  title: string;
  description: string;
  image: string;
  imdb_point: number;
  types: string[];
  release_year: number;
  director: string;
  duration: string;
};

// const mockMovies: ApiMovie[] = [
//   {
//     id: 1,
//     title: "Amerikan Sapigi",
//     description: "Psikolojik Film",
//     image: "/images/American_Psyho.jpg",
//     IMDB_Point: "9.8",
//     types: ["Suç", "Korku", "Gerilim", "Drama", "Popüler"],
//     releaseYear: 2000,
//     director: "Mary Harron",
//     duration: "102 dk",
//   },
//   {
//     id: 2,
//     title: "Harry Potter Felsefe Taşı",
//     description: "Fantastik-Bilim Kurgu Film",
//     image: "/images/Harry_Potter_Felsefe_Tasi.jpg",
//     IMDB_Point: "9.0",
//     types: ["Bilim Kurgu", "Gençlik", "Fantastik"],
//     releaseYear: 2001,
//     director: "Chris Columbus",
//     duration: "152 dk",
//   },
//   {
//     id: 3,
//     title: "Hulk",
//     description: "Fantastik-Süperkahraman Film",
//     image: "/images/Hulk.jpg",
//     IMDB_Point: "8.9",
//     types: ["Bilim Kurgu", "Fantastik", "Çizgi Roman"],
//     releaseYear: 2003,
//     director: "Ang Lee",
//     duration: "138 dk",
//   },
//   {
//     id: 4,
//     title: "Makinist",
//     description: "Psikolojik Gerilim Film",
//     image: "/images/Makinist.jpg",
//     IMDB_Point: "9.7",
//     types: ["Suç", "Korku", "Gerilim", "Drama"],
//     releaseYear: 2004,
//     director: "Brad Anderson",
//     duration: "101 dk",
//   },
//   {
//     id: 5,
//     title: "Kuzuların Sessizliği",
//     description: "Psikolojik Film",
//     image: "/images/KuzularınSessizliği.jpg",
//     IMDB_Point: "8.6",
//     types: ["Suç", "Korku", "Gerilim", "Drama", "Popüler"],
//     releaseYear: 1991,
//     director: "Jonathan Demme",
//     duration: "118 dk",
//   },
//   {
//     id: 6,
//     title: "Terminator",
//     description: "Fantastik-Bilim Kurgu Film",
//     image: "/images/Terminator.jpg",
//     IMDB_Point: "9.0",
//     types: ["Bilim Kurgu", "Aksiyon", "Fantastik", "Popüler"],
//     releaseYear: 1984,
//     director: "James Cameron",
//     duration: "97 dk",
//   },
//   {
//     id: 7,
//     title: "Hulk",
//     description: "Fantastik-Süperkahraman Film",
//     image: "/images/Hulk.jpg",
//     IMDB_Point: "8.9",
//     types: ["Bilim Kurgu", "Fantastik", "Çizgi Roman"],
//     releaseYear: 2003,
//     director: "Ang Lee",
//     duration: "138 dk",
//   },
//   {
//     id: 8,
//     title: "Makinist",
//     description: "Psikolojik Gerilim Film",
//     image: "/images/Makinist.jpg",
//     IMDB_Point: "9.7",
//     types: ["Suç", "Korku", "Gerilim", "Drama"],
//     releaseYear: 2004,
//     director: "Brad Anderson",
//     duration: "101 dk",
//   },
//   {
//     id: 9,
//     title: "Makinist",
//     description: "Psikolojik Gerilim Film",
//     image: "/images/Makinist.jpg",
//     IMDB_Point: "9.7",
//     types: ["Suç", "Korku", "Gerilim", "Drama"],
//     releaseYear: 2004,
//     director: "Brad Anderson",
//     duration: "101 dk",
//   },
//   {
//     id: 10,
//     title: "Amerikan Sapigi",
//     description: "Psikolojik Film",
//     image: "/images/American_Psyho.jpg",
//     IMDB_Point: "9.8",
//     types: ["Suç", "Korku", "Gerilim", "Drama", "Popüler"],
//     releaseYear: 2000,
//     director: "Mary Harron",
//     duration: "102 dk",
//   },
//   {
//     id: 11,
//     title: "Harry Potter Felsefe Taşı",
//     description: "Fantastik-Bilim Kurgu Film",
//     image: "/images/Harry_Potter_Felsefe_Tasi.jpg",
//     IMDB_Point: "9.0",
//     types: ["Bilim Kurgu", "Gençlik", "Fantastik"],
//     releaseYear: 2001,
//     director: "Chris Columbus",
//     duration: "152 dk",
//   },
//   {
//     id: 12,
//     title: "Hulk",
//     description: "Fantastik-Süperkahraman Film",
//     image: "/images/Hulk.jpg",
//     IMDB_Point: "8.9",
//     types: ["Bilim Kurgu", "Fantastik", "Çizgi Roman"],
//     releaseYear: 2003,
//     director: "Ang Lee",
//     duration: "138 dk",
//   },
//   {
//     id: 13,
//     title: "Makinist",
//     description: "Psikolojik Gerilim Film",
//     image: "/images/Makinist.jpg",
//     IMDB_Point: "9.7",
//     types: ["Suç", "Korku", "Gerilim", "Drama"],
//     releaseYear: 2004,
//     director: "Brad Anderson",
//     duration: "101 dk",
//   },
//   {
//     id: 14,
//     title: "Kuzuların Sessizliği",
//     description: "Psikolojik Film",
//     image: "/images/KuzularınSessizliği.jpg",
//     IMDB_Point: "8.6",
//     types: ["Suç", "Korku", "Gerilim", "Drama", "Popüler"],
//     releaseYear: 1991,
//     director: "Jonathan Demme",
//     duration: "118 dk",
//   },
//   {
//     id: 15,
//     title: "Terminator",
//     description: "Fantastik-Bilim Kurgu Film",
//     image: "/images/Terminator.jpg",
//     IMDB_Point: "9.0",
//     types: ["Bilim Kurgu", "Aksiyon", "Fantastik", "Popüler"],
//     releaseYear: 1984,
//     director: "James Cameron",
//     duration: "97 dk",
//   },
//   {
//     id: 16,
//     title: "Hulk",
//     description: "Fantastik-Süperkahraman Film",
//     image: "/images/Hulk.jpg",
//     IMDB_Point: "8.9",
//     types: ["Bilim Kurgu", "Fantastik", "Çizgi Roman"],
//     releaseYear: 2003,
//     director: "Ang Lee",
//     duration: "138 dk",
//   },
//   {
//     id: 17,
//     title: "Makinist",
//     description: "Psikolojik Gerilim Film",
//     image: "/images/Makinist.jpg",
//     IMDB_Point: "9.7",
//     types: ["Suç", "Korku", "Gerilim", "Drama"],
//     releaseYear: 2004,
//     director: "Brad Anderson",
//     duration: "101 dk",
//   },
// ];

export const movieApi = {
  search: async (q: string): Promise<ApiMovie[]> => {
    const response = await fetch(
      `${API_BASE_URL}/movies?search=${encodeURIComponent(q)}`
    );
    if (!response.ok) {
      throw new Error("Arama başarısız");
    }
    return response.json();
  },

  getAllMovies: async (): Promise<ApiMovie[]> => {
    const response = await fetch(`${API_BASE_URL}/movies`);
    if (!response.ok) {
      throw new Error("Filmler yüklenemedi");
    }
    return response.json();
  },

  getMovieById: async (id: number): Promise<ApiMovie | null> => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Film detayı yüklenemedi");
    }
    return response.json();
  },

  getMoviesByType: async (type: string): Promise<ApiMovie[]> => {
    const response = await fetch(
      `${API_BASE_URL}/movies?type=${encodeURIComponent(type)}`
    );
    if (!response.ok) {
      throw new Error("Tür bazlı filmler yüklenemedi");
    }
    return response.json();
  },

  // Diğer metodlar için mock veriler kullanabilirsiniz
  getPopular: async (): Promise<ApiMovie[]> => {
    const movies = await movieApi.getAllMovies();
    return movies.filter(
      (movie) =>
        movie.types.includes("Drama") || movie.types.includes("Fantastik")
    );
  },

  getTopRated: async (): Promise<ApiMovie[]> => {
    const movies = await movieApi.getAllMovies();
    return movies.filter((movie) => movie.imdb_point >= 9.0);
  },

  getNowPlaying: async (): Promise<ApiMovie[]> => {
    const movies = await movieApi.getAllMovies();
    return movies.filter(
      (movie) => movie.types.includes("Suç") || movie.types.includes("Korku")
    );
  },

  getUpcoming: async (): Promise<ApiMovie[]> => {
    const movies = await movieApi.getAllMovies();
    return movies.filter(
      (movie) =>
        movie.types.includes("Fantastik") || movie.types.includes("Bilim Kurgu")
    );
  },
};

// export const movieApi = {
//   search: async (q: string) => {
//     await new Promise((r) => setTimeout(r, 500));
//     const term = q.trim().toLowerCase();
//     if (!term) return mockMovies;
//     return mockMovies.filter(
//       (m) =>
//         m.title.toLowerCase().includes(term) ||
//         m.description.toLowerCase().includes(term) ||
//         m.types.some((t) => t.toLowerCase().includes(term)) ||
//         String(m.releaseYear).includes(term) ||
//         m.director.toLowerCase().includes(term)
//     );
//   },
//   // Tüm filmleri getir
//   getAllMovies: async (): Promise<ApiMovie[]> => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return mockMovies;
//   },

//   getPopular: async (): Promise<ApiMovie[]> => {
//     await new Promise((resolve) => setTimeout(resolve, 800));
//     return mockMovies.filter(
//       (movie) =>
//         movie.types.includes("Drama") || movie.types.includes("Fantastik")
//     );
//   },

//   // En iyi filmler
//   getTopRated: async (): Promise<ApiMovie[]> => {
//     await new Promise((resolve) => setTimeout(resolve, 1200));
//     return mockMovies.filter((movie) => parseFloat(movie.IMDB_Point) >= 9.0);
//   },

//   // Şu anda oynayan filmler
//   getNowPlaying: async (): Promise<ApiMovie[]> => {
//     await new Promise((resolve) => setTimeout(resolve, 900));
//     return mockMovies.filter(
//       (movie) => movie.types.includes("Suç") || movie.types.includes("Korku")
//     );
//   },

//   // Yakında gelecek filmler
//   getUpcoming: async (): Promise<ApiMovie[]> => {
//     await new Promise((resolve) => setTimeout(resolve, 1100));
//     return mockMovies.filter(
//       (movie) =>
//         movie.types.includes("Fantastik") || movie.types.includes("Bilim Kurgu")
//     );
//   },

//   // Tür bazlı filmler
//   getMoviesByType: async (type: string): Promise<ApiMovie[]> => {
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     return mockMovies.filter((movie) => movie.types.includes(type));
//   },

//   // Tek film detayı
//   getMovieById: async (id: number): Promise<ApiMovie | null> => {
//     await new Promise((resolve) => setTimeout(resolve, 600));
//     return mockMovies.find((movie) => movie.id === id) || null;
//   },

//   // Error test için
//   getMoviesWithError: async (): Promise<ApiMovie[]> => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     throw new Error("API bağlantı hatası");
//   },
