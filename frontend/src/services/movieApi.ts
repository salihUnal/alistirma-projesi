type ApiMovie = {
  id: number;
  title: string;
  description: string;
  image: string;
  IMDB_Point: string;
  types: string[];
  releaseYear: number;
  director: string;
  duration: string;
};

const mockMovies: ApiMovie[] = [
  {
    id: 1,
    title: "Amerikan Sapigi",
    description: "Psikolojik Film",
    image: "/images/American_Psyho.jpg",
    IMDB_Point: "9.8",
    types: ["Suç", "Korku", "Gerilim", "Drama"],
    releaseYear: 2000,
    director: "Mary Harron",
    duration: "102 dk",
  },
  {
    id: 2,
    title: "Harry Potter Felsefe Taşı",
    description: "Fantastik-Bilim Kurgu Film",
    image: "/images/Harry_Potter_Felsefe_Tasi.jpg",
    IMDB_Point: "9.0",
    types: ["Bilim Kurgu", "Gençlik", "Fantastik"],
    releaseYear: 2001,
    director: "Chris Columbus",
    duration: "152 dk",
  },
  {
    id: 3,
    title: "Hulk",
    description: "Fantastik-Süperkahraman Film",
    image: "/images/Hulk.jpg",
    IMDB_Point: "8.9",
    types: ["Bilim Kurgu", "Fantastik", "Çizgi Roman"],
    releaseYear: 2003,
    director: "Ang Lee",
    duration: "138 dk",
  },
  {
    id: 4,
    title: "Makinist",
    description: "Psikolojik Gerilim Film",
    image: "/images/Makinist.jpg",
    IMDB_Point: "9.7",
    types: ["Suç", "Korku", "Gerilim", "Drama"],
    releaseYear: 2004,
    director: "Brad Anderson",
    duration: "101 dk",
  },
  {
    id: 5,
    title: "Amerikan Sapigi",
    description: "Psikolojik Film",
    image: "/images/American_Psyho.jpg",
    IMDB_Point: "9.8",
    types: ["Suç", "Korku", "Gerilim", "Drama"],
    releaseYear: 2000,
    director: "Mary Harron",
    duration: "102 dk",
  },
  {
    id: 6,
    title: "Harry Potter Felsefe Taşı",
    description: "Fantastik-Bilim Kurgu Film",
    image: "/images/Harry_Potter_Felsefe_Tasi.jpg",
    IMDB_Point: "9.0",
    types: ["Bilim Kurgu", "Gençlik", "Fantastik"],
    releaseYear: 2001,
    director: "Chris Columbus",
    duration: "152 dk",
  },
  {
    id: 7,
    title: "Hulk",
    description: "Fantastik-Süperkahraman Film",
    image: "/images/Hulk.jpg",
    IMDB_Point: "8.9",
    types: ["Bilim Kurgu", "Fantastik", "Çizgi Roman"],
    releaseYear: 2003,
    director: "Ang Lee",
    duration: "138 dk",
  },
  {
    id: 8,
    title: "Makinist",
    description: "Psikolojik Gerilim Film",
    image: "/images/Makinist.jpg",
    IMDB_Point: "9.7",
    types: ["Suç", "Korku", "Gerilim", "Drama"],
    releaseYear: 2004,
    director: "Brad Anderson",
    duration: "101 dk",
  },
];

export const movieApi = {
  search: async (q: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const term = q.trim().toLowerCase();
    if (!term) return mockMovies;
    return mockMovies.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term) ||
        m.types.some((t) => t.toLowerCase().includes(term)) ||
        String(m.releaseYear).includes(term) ||
        m.director.toLowerCase().includes(term)
    );
  },
  // Tüm filmleri getir
  getAllMovies: async (): Promise<ApiMovie[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockMovies;
  },

  // Popüler filmler
  getPopular: async (): Promise<ApiMovie[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockMovies.filter(
      (movie) =>
        movie.types.includes("Drama") || movie.types.includes("Fantastik")
    );
  },

  // En iyi filmler
  getTopRated: async (): Promise<ApiMovie[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return mockMovies.filter((movie) => parseFloat(movie.IMDB_Point) >= 9.0);
  },

  // Şu anda oynayan filmler
  getNowPlaying: async (): Promise<ApiMovie[]> => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return mockMovies.filter(
      (movie) => movie.types.includes("Suç") || movie.types.includes("Korku")
    );
  },

  // Yakında gelecek filmler
  getUpcoming: async (): Promise<ApiMovie[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1100));
    return mockMovies.filter(
      (movie) =>
        movie.types.includes("Fantastik") || movie.types.includes("Bilim Kurgu")
    );
  },

  // Tür bazlı filmler
  getMoviesByType: async (type: string): Promise<ApiMovie[]> => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return mockMovies.filter((movie) => movie.types.includes(type));
  },

  // Tek film detayı
  getMovieById: async (id: number): Promise<ApiMovie | null> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockMovies.find((movie) => movie.id === id) || null;
  },

  // Error test için
  getMoviesWithError: async (): Promise<ApiMovie[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    throw new Error("API bağlantı hatası");
  },
};
