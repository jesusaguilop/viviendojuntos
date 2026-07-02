"use client";

import { useState } from "react";
import { crearAporte } from "@/app/actions/aportes";
import type { Meta } from "@/types";

export default function AportesForm({ metas }: { metas: Meta[] }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await crearAporte(new FormData(e.currentTarget));
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch {
      alert("Error al crear el aporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-2xl border border-border p-5 space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        </div>
        <h3 className="font-bold text-text text-lg">Nuevo aporte</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">
          Monto ($)
        </label>
        <input
          type="number"
          name="monto"
          step="0.01"
          min="0.01"
          required
          placeholder="0.00"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">
          Meta
        </label>
        <select
          name="meta_id"
          required
          className="input-field"
        >
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

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "Guardando..." : "Agregar aporte"}
      </button>

      {success && (
        <p className="text-accent text-sm text-center font-medium animate-fade-in">
          ¡Aporte registrado!
        </p>
      )}
    </form>
  );
}
