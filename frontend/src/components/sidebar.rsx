import React from "react";

type SidebarItem = {
  label: string;
  icon?: React.ReactNode;
  href?: string;
};

type SidebarProps = {
  title?: string;
  items?: SidebarItem[];
  footer?: React.ReactNode;
};

export default function Sidebar({
  title = "Panel",
  items = [
    { label: "Dashboard" },
    { label: "Projects" },
    { label: "Tasks" },
    { label: "Calendar" },
    { label: "Settings" }
  ],
  footer
}: SidebarProps) {
  return (
    <aside className="h-full w-64 bg-white/80 backdrop-blur border-r border-gray-200 shadow-sm">
      <div className="px-4 py-4 flex items-center justify-between">
        <span className="text-xl font-semibold tracking-wide text-gray-800">{title}</span>
      </div>
      <nav className="px-2 py-2">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href || "#"}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <span className="inline-flex h-2 w-2 rounded-full bg-gray-300" />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {footer && <div className="mt-auto px-4 py-4">{footer}</div>}
    </aside>
  );
}


