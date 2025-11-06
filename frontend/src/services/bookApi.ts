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
  like_count?: number;
  is_liked?: boolean;
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

  updateBookReadStatus: async (
    id: number,
    is_read: boolean
  ): Promise<ApiBook> => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // NOT: Eğer ilerde bu endpoint'i korumalı yaparsanız
        // (örn: sadece giriş yapan kullanıcı güncelleyebilsin),
        // buraya 'Authorization' header'ı eklemeniz gerekecek.
        // 'Authorization': `Bearer ${kullaniciTokeni}`
      },
      body: JSON.stringify({ is_read: is_read }),
    });
    if (!response.ok) {
      throw new Error("Kitap okunma durumu güncellenemedi");
    }
    return response.json();
  },

  toggleBookLike: async (id: number, liked: boolean): Promise<void> => {
    const method = liked ? "POST" : "DELETE";
    const response = await fetch(`${API_BASE_URL}/books/${id}/like`, {
      method,
      headers: {
        "Content-Type": "application/json",
        // İleride auth eklenirse:
        // "Authorization": `Bearer ${token}`
      },
    });
    if (!response.ok) {
      throw new Error("Beğeni durumu güncellenemedi");
    }
  },

  // 2. Kitap beğeni durumunu getirme (opsiyonel)
  getBookLikeStatus: async (
    id: number
  ): Promise<{ liked: boolean; count: number }> => {
    const response = await fetch(`${API_BASE_URL}/books/${id}/like`);
    if (!response.ok) {
      throw new Error("Beğeni durumu alınamadı");
    }
    return response.json();
  },
};
