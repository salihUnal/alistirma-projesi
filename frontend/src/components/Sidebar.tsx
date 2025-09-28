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
      ],
    },
    { label: "Calendar" },
    { label: "Settings" },
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
            w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-400
            text-gray-700 hover:bg-blue-50 hover:text-blue-700 
            transition-all duration-200 ease-in-out
            ${level > 0 ? "ml-4 text-sm" : "font-medium"}
            ${hasChildren ? "justify-between" : ""}
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className={`
              w-2 h-2 rounded-full 
              ${level === 0 ? "bg-blue-500" : "bg-green-400"}
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
          <ul className="mt-1 space-y-1 overflow-hidden">
            {item.children.map((child) => renderMenuItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className="h-full w-64 bg-slate-800/80 backdrop-blur border-r border-slate-600 shadow-sm rounded-xl ">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-100">
        <h2 className=" font-extrabold text-2xl text-gray-100 tracking-tight">
          {title}
        </h2>
      </div>
      {/* Navigation */}
      <nav className="px-4 py-4">
        <ul className="space-y-2">
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
