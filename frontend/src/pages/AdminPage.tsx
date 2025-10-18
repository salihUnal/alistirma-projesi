import React from "react";
import ThemeToggle from "../components/common/ThemeToggle";

function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ThemeToggle />
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Admin Paneli</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Yönetim Paneli</h2>
        <p>Bu sayfa sadece admin kullanıcıları tarafından görüntülenebilir.</p>
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800">Kullanıcı Yönetimi</h3>
            <p className="text-blue-600">
              Kullanıcıları görüntüle, düzenle ve sil
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800">İçerik Yönetimi</h3>
            <p className="text-green-600">Film ve TV show içeriklerini yönet</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800">Sistem Ayarları</h3>
            <p className="text-purple-600">
              Sistem konfigürasyonlarını düzenle
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
