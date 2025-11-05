import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type SidebarItem = {
  label: string;
  icon?: React.ReactNode;
  href?: string; // mevcut
  to?: string; // EKLE: SPA route
  onClick?: () => void;
  children?: SidebarItem[];
};

type SidebarProps = {
  title?: string;
  items?: SidebarItem[];
  footer?: React.ReactNode;
  onItemClick?: (label: string) => void;
};

export default function Sidebar({
  title = "Panel",
  items = [
    { label: "Anasayfa", to: "/" },
    {
      label: "Kitap listesi",
      children: [
        { label: "Tümü", to: "/books" },
        { label: "Allegori", to: "/books/Allegori" },
        { label: "Anı", to: "/books/Ani" },
        { label: "Bilim Kurgu", to: "/books/Bilim-Kurgu" },
        { label: "Biyografi", to: "/books/Biyografi" },
        { label: "Deneme", to: "/books/Deneme" },
        { label: "Distopya", to: "/books/Distopya" },
        { label: "Fantastik", to: "/books/Fantastik" },
        { label: "Felsefe", to: "/books/Felsefe" },
        { label: "Günlük", to: "/books/Gunluk" },
        { label: "Kişisel Gelişim", to: "/books/Kisisel-Gelisim" },
        { label: "Macera" },
        { label: "Mektup", to: "/books/Mektup" },
        { label: "Otobiyografi", to: "/books/Otobiyografi" },
        { label: "Roman", to: "/books/Roman" },
        { label: "Tarih", to: "/books/Tarih" },
        { label: "Tiyatro", to: "/books/Tiyatro" },
        { label: "Çocuk Edebiyatı", to: "/books/Cocuk-Edebiyati" },
        { label: "Öykü", to: "/books/Oyku" },
      ],
    },
    {
      label: "Filmler",
      children: [
        { label: "Tümü", to: "/movies" },
        { label: "Aksiyon", to: "/movies/Aksiyon" },
        { label: "Komedi", to: "/movies/Komedi" },
        { label: "Drama", to: "/movies/Drama" },
        { label: "Suç", to: "/movies/Suc" },
        { label: "Korku", to: "/movies/Korku" },
        { label: "Fantastik", to: "/movies/Fantastik" },
        { label: "Bilim Kurgu", to: "/movies/Bilim-Kurgu" },
        { label: "Gerilim", to: "/movies/Gerilim" },
        { label: "Çizgi Roman", to: "/movies/Cizgi-Roman" },
        { label: "Gençlik", to: "/movies/Genclik" },
        { label: "Popüler", to: "/movies/Populer" },
      ],
    },
    { label: "Şiirler" },
    { label: "Özlü Sözler" },
    { label: "Yapılacaklar" },
    { label: "Ayarlar" },
  ],
  footer,
  onItemClick,
}: SidebarProps) {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);

    return (
      <div className="pr-4" key={item.label}>
        <li>
          <button
            onClick={() => {
              if (hasChildren) {
                // Sadece aç/kapa yap; parent için navigation tetikleme
                toggleExpanded(item.label);
              } else {
                // Yaprak: explicit route → fallback href/onClick/onItemClick
                if (item.to) {
                  navigate(item.to);
                  return;
                } else if (item.href) {
                  window.location.href = item.href;
                } else if (item.onClick) {
                  item.onClick();
                } else {
                  onItemClick?.(item.label);
                }
              }
            }}
            className={`
            w-full flex items-center gap-5 px-7 py-3 rounded-full bg-white dark:border-separate border-2 border-blue-200 dark:border-gray-500 dark:bg-gray-800 dark:text-white
            text-gray-900 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-500 dark:hover:text-white
            transition-all duration-200 ease-in-out
            ${level > 0 ? "ml-4 text-sm" : "font-medium"}
            ${hasChildren ? "justify-between" : ""}
          `}
          >
            <div className="flex items-center gap-4">
              <div
                className={`
              w-2 h-2 rounded-full 
              ${level === 0 ? "bg-blue-500" : "bg-green-500"}
            `}
              />
              <span>{item.label}</span>
            </div>

            {hasChildren && (
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>

          {hasChildren && isExpanded && item.children && (
            <ul className="mt-1 space-y-2 overflow-clip">
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </ul>
          )}
        </li>
      </div>
    );
  };

  return (
    // <aside className="h-full w-64 bg-white backdrop-blur border-separate border-slate-800 shadow-sm rounded-xl ">
    <aside className="h-full w-64 bg-white backdrop-blur border border-slate-400 dark:border-slate-700 shadow-sm rounded-xl dark:bg-gray-900 ">
      {/* Header */}
      <div className="px-6 py-6 border-b-2  border-blue-300 dark:border-blue-700 ">
        <h2 className=" font-extrabold text-2xl text-gray-900  tracking-tight dark:text-white">
          {title}
        </h2>
      </div>
      {/* Navigation */}
      <nav className=" pl-4 pr-1 py-4 ">
        <ul className="space-y-2  ">
          {items.map((item) => renderMenuItem(item))}
        </ul>
      </nav>
      {/* Footer */}
      {footer && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
          {footer}
        </div>
      )}
    </aside>
  );
}
