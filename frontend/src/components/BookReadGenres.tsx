// components/BookReadGenres.tsx

import React from "react";

interface BookReadGenresProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string; // Dışarıdan stil verebilmek için
  disabled?: boolean;
}

export default function BookReadGenres({
  value,
  onChange,
  className,
  disabled,
}: BookReadGenresProps) {
  const bookGenres = [
    "Alegori",
    "Anı",
    "Akademik",
    "Antoloji",
    "Araştırma - İnceleme",
    "Bilim",
    "Bilim Kurgu",
    "Biyografi",
    "Çizgi Roman / Manga",
    "Çocuk Edebiyatı",
    "Deneme",
    "Din ve Mitoloji",
    "Distopya",
    "Edebiyat",
    "Eğitim / Akademik",
    "Ekonomi",
    "Fantastik",
    "Felsefe",
    "Gezi / Seyahat",
    "Genç Yetişkin (Young Adult)",
    "Gerilim",
    "Günlük",
    "Hikaye (Öykü)",
    "Hobi",
    "Kişisel Gelişim",
    "Klasikler",
    "Korku",
    "Macera",
    "Mektup",
    "Mizah",
    "Otobiyografi",
    "Polisiye",
    "Psikoloji",
    "Referans",
    "Roman",
    "Sağlık",
    "Sanat",
    "Siyaset",
    "Sosyoloji",
    "Şiir",
    "Tarih",
    "Tarihi Kurgu",
    "Tiyatro",
    "Diğer",
  ];

  return (
    <select
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled}
    >
      <option value="">Tür Seçiniz</option>
      {bookGenres.map((genre, index) => (
        <option key={index} value={genre}>
          {genre}
        </option>
      ))}
    </select>
  );
}
