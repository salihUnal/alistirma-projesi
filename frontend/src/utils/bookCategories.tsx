// örn. frontend/src/utils/bookCategories.ts
export const BOOK_CATEGORIES = [
  "Roman",
  "Bilim-Kurgu",
  "Tarih",
  "Kisisel-Gelisim",
  "Distopya",
  "Oyku",
  "Cocuk-Edebiyati",
  "Otobiyografi",
  "Mektup",
  "Macera",
  "Felsefe",
  "Gunluk",
  "Fantastik",
  "Deneme",
  "Biyografi",
  "Ani",
  "Allegori",
  "Genclik",
];

export const LABEL_TO_BOOK_SLUG: Record<string, string> = {
  "Kitap listesi": "",
  Roman: "Roman",
  "Bilim Kurgu": "Bilim-Kurgu",
  Tarih: "Tarih",
  "Kişisel Gelişim": "Kisisel-Gelisim",
  Distopya: "Distopya",
  Öykü: "Oyku",
  "Çocuk Edebiyatı": "Cocuk-Edebiyati",
  Otobiyografi: "Otobiyografi",
  Mektup: "Mektup",
  Macera: "Macera",
  Felsefe: "Felsefe",
  Günlük: "Gunluk",
  Fantastik: "Fantastik",
  Deneme: "Deneme",
  Biyografi: "Biyografi",
  Anı: "Ani",
  Allegori: "Allegori",
  Gençlik: "Genclik",
};

export const BOOK_SLUG_TO_GENRE: Record<string, string> = {
  "Bilim-Kurgu": "Bilim Kurgu",
  "Kisisel-Gelisim": "Kişisel Gelişim",
  "Cocuk-Edebiyati": "Çocuk Edebiyatı",
  Gunluk: "Günlük",
  Genclik: "Gençlik",
  // Diğerleri slug=genre zaten aynı
};

export const isBookCategory = (value?: string) =>
  !!value && BOOK_CATEGORIES.includes(value);

export const buildBookUrl = (category?: string) =>
  category ? `/books/${category}` : `/books`;
