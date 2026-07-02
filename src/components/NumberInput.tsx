"use client";

import { useState } from "react";
import { numeroALetras } from "@/lib/numeroALetras";

interface NumberInputProps {
  name: string;
  placeholder?: string;
  required?: boolean;
  step?: string;
  min?: string;
  label?: string;
}

export default function NumberInput({
  name,
  placeholder = "0.00",
  required,
  step = "0.01",
  min = "0.01",
  label,
}: NumberInputProps) {
  const [raw, setRaw] = useState("");
  const [focused, setFocused] = useState(false);

  const value = parseFloat(raw.replace(/\./g, "").replace(",", "."));
  const valido = !isNaN(value) && value > 0;
  const enPalabras = valido ? numeroALetras(Math.floor(value)) : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9.,]/g, "");
    setRaw(cleaned);
  };

  const displayValue = focused ? raw : formatear(raw);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text mb-1">{label}</label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-medium text-sm pointer-events-none">
          $
        </div>
        <input
          type="text"
          inputMode="decimal"
          name={name}
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          className="input-field pl-8"
        />
      </div>
      {enPalabras && (
        <p key={enPalabras} className="text-xs text-accent font-medium mt-1 animate-slide-up">
          {enPalabras}
        </p>
      )}
    </div>
  );
}

function formatear(val: string): string {
  const nums = val.replace(/[^0-9]/g, "");
  if (!nums) return "";
  const entero = nums.slice(0, -2) || "0";
  const decimal = nums.slice(-2).padStart(2, "0");
  const conPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${conPuntos},${decimal}`;
}
