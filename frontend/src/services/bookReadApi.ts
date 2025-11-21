const API_BASE_URL = "http://localhost:3001/api";

type ApiBookRead = {
  Id: number;
  Book_Name: string;
  Completed: boolean;
  Author_Name: string;
  Genre: string;
  Like_Count: number;
  is_liked?: boolean;
  User_Id: number;
  Creation_At: number;
  Updated_At: number;
};

export const BookReadApi = {
  search: async (q: string): Promise<ApiBookRead[]> => {
    const response = await fetch(
      `${API_BASE_URL}/mybooks?search=${encodeURIComponent(q)}`
    );

    if (!response.ok) {
      throw new Error("Arama Başarısız");
    }
    return response.json();
  },

  updateBookRead: async (
    id: number,
    payload: { Book_Name: string; Author_Name?: string | null }
  ): Promise<ApiBookRead> => {
    const response = await fetch(`${API_BASE_URL}/mybooks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Kitap Güncellenemedi");
    return response.json();
  },

  getAllReadBook: async (): Promise<ApiBookRead[]> => {
    const response = await fetch(`${API_BASE_URL}/mybooks`);
    if (!response.ok) {
      throw new Error("Kitaplar Yüklenemedi");
    }
    return response.json();
  },

  getBookReadById: async (id: number): Promise<ApiBookRead | null> => {
    const response = await fetch(`${API_BASE_URL}/mybooks/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Kitap detayı yüklenemedi");
    }
    return response.json();
  },

  addBookRead: async (readbook: {
    Book_Name: string;
    Author_Name: string;
    Completed?: boolean;
    Genre: string;
    User_Id: number;
  }): Promise<ApiBookRead> => {
    const response = await fetch(`${API_BASE_URL}/mybooks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(readbook),
    });
    if (!response.ok) throw new Error("Kitap Eklenemedi");
    return response.json();
  },

  deletedBookRead: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/mybooks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Kitap Bulunamadı");
      }
      throw new Error("Kitap Silinemedi");
    }
    return response.json();
  },

  updateBookRead: async (
    id: number,
    readbook: {
      Book_Name: string;
      Author_Name: string;
      Completed?: boolean;
      Genre?: string;
    }
  ): Promise<ApiBookRead> => {
    const response = await fetch(`${API_BASE_URL}/mybooks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(readbook),
    });
    if (!response.ok) throw new Error("Kitap Güncellenemedi");
    return response.json();
  },

  toggleBookLike: async (id: number, liked: boolean): Promise<void> => {
    const method = liked ? "POST" : "DELETE";
    const response = await fetch(`${API_BASE_URL}/mybooks/${id}/like`, {
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

  getBookLikeStatus: async (
    id: number
  ): Promise<{ liked: boolean; count: number }> => {
    const response = await fetch(`${API_BASE_URL}/mybooks/${id}/like`);
    if (!response.ok) {
      throw new Error("Beğeni durumu alınamadı");
    }
    return response.json();
  },
};

export default BookReadApi;
