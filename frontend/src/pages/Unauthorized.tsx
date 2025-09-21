// src/pages/Unauthorized.tsx
import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-red-500">403</h1>
      <p className="text-xl mt-4">Bu sayfaya erişim yetkiniz yok</p>
      <p className="text-gray-600 mt-2">
        Bu sayfayı görüntülemek için gerekli yetkiye sahip değilsiniz.
      </p>
      <div className="mt-6 space-x-4">
        <Link
          to="/"
          className="text-blue-500 hover:underline px-4 py-2 border border-blue-500 rounded"
        >
          Ana sayfaya dön
        </Link>
        <Link
          to="/login"
          className="text-green-500 hover:underline px-4 py-2 border border-green-500 rounded"
        >
          Farklı hesap ile giriş yap
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;
