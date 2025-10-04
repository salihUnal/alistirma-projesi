import React, { useState } from "react";

type SidebarItem = {
  label: string;
  icon?: React.ReactNode;
  href?: string;
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
    {
      label: "Kitap listesi",
      children: [
        { label: "Roman" },
        { label: "Bilim Kurgu Kitap" },
        { label: "Tarih" },
      ],
    },
    { label: "Özlü Sözler" },
    {
      label: "Filmler",
      children: [
        { label: "Aksiyon" },
        { label: "Komedi" },
        { label: "Drama" },
        { label: "Suç" },
        { label: "Korku" },
        { label: "Fantastik" },
        { label: "Bilim Kurgu" },
        { label: "Gerilim" },
        { label: "Çizgi Roman" },
        { label: "Gençlik" },
        { label: "Popüler" },
      ],
    },
    { label: "Yapılacaklar" },
    { label: "Ayarlar" },
  ],
  footer,
  onItemClick,
}: SidebarProps) {
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
      <div className="pr-4">
        <li key={item.label}>
          <button
            onClick={() => {
              if (hasChildren) {
                toggleExpanded(item.label);
                onItemClick?.(item.label);
              } else {
                item.onClick?.();
                onItemClick?.(item.label);
              }
            }}
            className={`
            w-full flex items-center gap-5 px-7 py-3 rounded-lg bg-white dark:border-separate border-2 border-blue-200 dark:border-gray-500 dark:bg-gray-800 dark:text-white
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
