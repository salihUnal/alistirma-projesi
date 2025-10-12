const API_BASE_URL = "http://localhost:3001/api";

type ApiBook = {
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

export const bookApi = {
  search: async (q: string): Promise<ApiBook[]> => {
    const response = await fetch(
      `${API_BASE_URL}/books?search=${encodeURIComponent(q)}`
    );
    if (!response.ok) {
      throw new Error("Arama Başarısız");
    }
    return response.json();
  },

  getAllBooks: async (): Promise<ApiBook[]> => {
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) {
      throw new Error("Kitaplar yüklenemedi");
    }
    return response.json();
  },

  getBookById: async (id: number): Promise<ApiBook | null> => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Kitap detayı yüklenemedi");
    }
    return response.json();
  },

  getBooksByGenre: async (genre: string): Promise<ApiBook[]> => {
    const response = await fetch(
      `${API_BASE_URL}/books?genre=${encodeURIComponent(genre)}`
    );
    if (!response.ok) {
      throw new Error("Tür bazlı kitaplar yüklenemedi");
    }
    return response.json();
  },
};
