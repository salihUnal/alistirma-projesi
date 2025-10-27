import React, { useState } from "react";

// --- İkonları buraya ekliyoruz (harici kütüphaneye gerek kalmadan) ---

// Göster ikonu (Göz)
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 10.224 7.29 6.332 12 6.332c4.71 0 8.577 3.892 9.964 5.351a1.012 1.012 0 0 1 0 .639C20.577 13.776 16.71 17.668 12 17.668c-4.71 0-8.577-3.892-9.964-5.351Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

// Gizle ikonu (Üzeri Çizgili Göz)
const EyeSlashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 14.3 7.234 17.668 12 17.668c.317 0 .63.013.938.037a10.5 10.5 0 0 0 2.583-.681M21.066 12c-1.292-2.3-5.3-5.668-9.066-5.668a10.5 10.5 0 0 0-1.242.08M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-18-18" />
  </svg>
);

// --- Bileşenin Prop (Özellik) Arayüzü ---
interface FloatingLabelInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
}

// --- GÜNCELLENMİŞ BİLEŞEN ---
const FloatingLabelInput = ({
  id,
  label,
  type: originalType, // Prop'u 'originalType' olarak yeniden adlandırdık
  value,
  onChange,
  ...props
}: FloatingLabelInputProps) => {
  // 1. Şifreyi gösterip göstermeyeceğimizi takip eden state
  const [showPassword, setShowPassword] = useState(false);

  // 2. Bu alanın bir şifre alanı olup olmadığını kontrol et
  const isPassword = originalType === "password";

  // 3. Girişin o anki 'type' özelliğini belirle
  // Eğer şifre alanıysa, 'showPassword' durumuna göre 'text' veya 'password' yap
  const currentType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : originalType;

  // 4. Durumu değiştiren toggle fonksiyonu
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative mb-6">
      <input
        id={id}
        type={currentType} // 5. Dinamik 'type' kullan
        value={value}
        onChange={onChange}
        // 6. Yazının ikonun altına girmemesi için sağdan padding (pr-10)
        className="block w-full px-3 py-3 pr-10 text-base text-white bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-400 peer"
        placeholder=" " // Floating label için bu gerekli
        {...props}
      />
      <label
        htmlFor={id}
        // Orijinal floating label stilleriniz (tahmini)
        className="absolute left-3 top-3 z-10 origin-[0] -translate-y-7 scale-75 transform text-gray-300 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-blue-400"
      >
        {label}
      </label>

      {/* === 7. YENİ EKLENEN BUTON === */}
      {isPassword && (
        <button
          type="button" // Formu göndermemesi için 'type="button"'
          onClick={toggleShowPassword}
          // Butonu input'un içine, sağa ve ortaya konumlandır
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white cursor-pointer"
        >
          {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      )}
      {/* === BUTONUN SONU === */}
    </div>
  );
};

export default FloatingLabelInput;

// import React, { useState } from "react";

// // 1. ADIM: Component'in alacağı prop'lar için bir interface tanımla
// interface FloatingLabelInputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   // React'in standart <input> özelliklerini (autoComplete, vs.) miras al
//   id: string; // id'nin string ve zorunlu olmasını sağla
//   label: string; // label adında ek bir prop ekle, string ve zorunlu
//   value: string; // value'nun string ve zorunlu olmasını sağla
//   // onChange'in bir event alacağını ve bir şey döndürmeyeceğini belirt
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// // 2. ADIM: Component'e bu interface'i uygula
// function FloatingLabelInput({
//   id,
//   label,
//   value,
//   onChange,
//   type = "text",
//   ...props
// }: FloatingLabelInputProps) {
//   // <-- DEĞİŞİKLİK BURADA
//   const [isFocused, setIsFocused] = useState(false);

//   const isFloating = isFocused || (value && value.length > 0);

//   // 3. ADIM: handleFocus ve handleBlur'daki 'e' parametrelerini tiple
//   const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
//     // <-- DEĞİŞİKLİK BURADA
//     setIsFocused(true);
//     if (props.onFocus) props.onFocus(e);
//   };

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     // <-- DEĞİŞİKLİK BURADA
//     setIsFocused(false);
//     if (props.onBlur) props.onBlur(e);
//   };

//   // ... (labelClasses ve inputClasses kodunuz aynı kalabilir) ...

//   const labelClasses = `
//     absolute
//     left-3
//     pointer-events-none
//     transition-all
//     duration-200
//     ease-in-out
//     ${
//       isFloating
//         ? "rounded-md top-[-15px] text-xs bg-white px-1 text-blue-500"
//         : "top-3 text-sm text-gray-500"
//     }
//   `;

//   const inputClasses = `
//     w-full
//     px-3
//     py-3
//     text-base
//     border
//     rounded-full
//     focus:outline-none
//     ${isFocused ? "border-blue-600" : "border-gray-300"}
//   `;

//   return (
//     <div className="relative mb-5 font-sans italic ">
//       <label htmlFor={id} className={labelClasses}>
//         {label}
//       </label>
//       <input
//         type={type}
//         id={id}
//         value={value}
//         onChange={onChange}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         className={inputClasses}
//         {...props}
//       />
//     </div>
//   );
// }

// export default FloatingLabelInput;
