import React from "react";

interface DashboardProps {
  username: string;
  userRole: string;
  isLoggedIn: boolean;
  onLogout: () => void;
  onRoleChange: (role: string) => void;
}

function Dashboard({
  username,
  userRole,
  isLoggedIn,
  onLogout,
  onRoleChange,
}: DashboardProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 text-right">
        <span className="mr-4">Hoşgeldin, {username}!</span>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Çıkış Yap
        </button>
      </div>

      <div>
        <footer className="text-center rounded-xl bg-gray-200 text-orange-500 font-medium italic border border-gray-500">
          Powered By{" "}
          <span className="ml-1 font-bold text-blue-700 underline tracking-wider uppercase">
            {username}
          </span>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
