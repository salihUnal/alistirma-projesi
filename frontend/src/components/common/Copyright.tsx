import React from "react";

// Bu versiyonda 'children' yerine 'companyName' gibi
// daha anlamlı bir prop alabiliriz.
interface CopyrightProps {
  companyName: string;
  startYear?: number; // Opsiyonel: Şirketin kurulduğu yıl
}

function Copyright({ companyName, startYear }: CopyrightProps) {
  // 1. JavaScript ile mevcut yılı otomatik al
  const currentYear = new Date().getFullYear();

  // 2. Eğer bir başlangıç yılı verilmişse ve bu yıldan farklıysa,
  //    "2020 - 2025" gibi bir aralık göster.
  const yearDisplay =
    startYear && startYear !== currentYear
      ? `${startYear} - ${currentYear}`
      : currentYear;

  return (
    <p>
      &copy; {yearDisplay} {companyName}. Tüm hakları saklıdır.
    </p>
  );
}

export default Copyright;
