import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="text-center">
      <h1>Hoş Geldiniz!!</h1>
      {/* Film Kategorileri */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <Link
          to="/movies/popular"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Popüler
        </Link>
        <Link
          to="/movies/top-rated"
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          En İyi
        </Link>
        <Link
          to="/movies/now-playing"
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Şu Anda
        </Link>
        <Link
          to="/movies/upcoming"
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
        >
          Yakında
        </Link>
        <Link
          to="/movies/Populer"
          className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
        >
          Popüler
        </Link>
      </div>

      {/* Tür Bazlı Kategoriler */}
      <div className="flex flex-wrap justify-center gap-2">
        <Link
          to="/movies/drama"
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
        >
          Drama
        </Link>
        <Link
          to="/movies/thriller"
          className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
        >
          Gerilim
        </Link>
        <Link
          to="/movies/scifi"
          className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 text-sm"
        >
          Bilim Kurgu
        </Link>
        <Link
          to="/movies/fantasy"
          className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm"
        >
          Fantastik
        </Link>
      </div>
    </div>
  );
}

export default Header;
