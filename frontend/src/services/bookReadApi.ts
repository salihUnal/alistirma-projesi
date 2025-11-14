const API_BASE_URL = "http://localhost:3001/api";

type ApiBookRead = {
  Id: number;
  Book_Name: string;
  Completed: boolean;
  Author_Name: string;
  Creation_At: number;
  Updated_At: number;
  User_Id: number;
};

export const BookReadApi = {
  search: async (q: string): Promise<ApiBookRead[]> => {
    const response = await fetch(
      `${API_BASE_URL}/mybooks?search=${encodeURIComponent(q)}`
    );

    if (!response) {
      throw new Error("Arama Başarısız");
    }
    return response.json();
  },

  getAllReadBook: async (): Promise<ApiBookRead[]> => {
    const response = await fetch(`${API_BASE_URL}/mybooks`);
    if (!response) {
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
};
