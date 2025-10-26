// src/components/common/FloatingLabelInput.tsx

import React, { useState } from "react";

// 1. ADIM: Component'in alacağı prop'lar için bir interface tanımla
interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // React'in standart <input> özelliklerini (autoComplete, vs.) miras al
  id: string; // id'nin string ve zorunlu olmasını sağla
  label: string; // label adında ek bir prop ekle, string ve zorunlu
  value: string; // value'nun string ve zorunlu olmasını sağla
  // onChange'in bir event alacağını ve bir şey döndürmeyeceğini belirt
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 2. ADIM: Component'e bu interface'i uygula
function FloatingLabelInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  ...props
}: FloatingLabelInputProps) {
  // <-- DEĞİŞİKLİK BURADA
  const [isFocused, setIsFocused] = useState(false);

  const isFloating = isFocused || (value && value.length > 0);

  // 3. ADIM: handleFocus ve handleBlur'daki 'e' parametrelerini tiple
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // <-- DEĞİŞİKLİK BURADA
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // <-- DEĞİŞİKLİK BURADA
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  // ... (labelClasses ve inputClasses kodunuz aynı kalabilir) ...

  const labelClasses = `
    absolute
    left-3
    pointer-events-none
    transition-all
    duration-200
    ease-in-out
    ${
      isFloating
        ? "rounded-md top-[-15px] text-xs bg-white px-1 text-blue-500"
        : "top-3 text-sm text-gray-500"
    }
  `;

  const inputClasses = `
    w-full
    px-3
    py-3 
    text-base
    border
    rounded-full
    focus:outline-none
    ${isFocused ? "border-blue-600" : "border-gray-300"}
  `;

  return (
    <div className="relative mb-5 font-sans italic ">
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={inputClasses}
        {...props}
      />
    </div>
  );
}

export default FloatingLabelInput;
