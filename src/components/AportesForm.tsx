"use client";

import { useState } from "react";
import { crearAporte } from "@/app/actions/aportes";
import NumberInput from "./NumberInput";
import { useToast } from "@/lib/toast";
import type { Meta } from "@/types";

export default function AportesForm({ metas }: { metas: Meta[] }) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await crearAporte(new FormData(e.currentTarget));
      showToast("¡Aporte registrado!", "success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al crear el aporte", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-2xl border border-border p-4 md:p-5 space-y-3 md:space-y-4"
    >
      <div className="flex items-center gap-2 mb-1 md:mb-2">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        </div>
        <h3 className="font-bold text-text text-base md:text-lg">Nuevo aporte</h3>
      </div>

      <NumberInput name="monto" label="Monto ($)" />

      <div>
        <label className="block text-sm font-medium text-text mb-1">
          Meta
        </label>
        <select name="meta_id" required className="input-field">
          <option value="">Seleccionar meta</option>
          {metas.map((meta) => (
            <option key={meta.id} value={meta.id}>
              {meta.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">
          Nota (opcional)
        </label>
        <input
          type="text"
          name="nota"
          placeholder="Ej: Primer sueldo del mes"
          className="input-field"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Guardando..." : "Agregar aporte"}
      </button>
    </form>
  );
}
