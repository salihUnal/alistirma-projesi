import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-400">404</h1>
      <p className="text-xl mt-4">Sayfa bulunamadı</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Ana sayfaya dön
      </Link>
    </div>
  );
}

export default NotFoundPage;
