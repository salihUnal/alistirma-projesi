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

export const isBookCategory = (value?: string) =>
  !!value && BOOK_CATEGORIES.includes(value);

export const buildBookUrl = (category?: string) =>
  category ? `/books/${category}` : `/books`;
