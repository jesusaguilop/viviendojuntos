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
      <h3 className="font-bold text-text text-lg">Nuevo aporte</h3>

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
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">
          Meta
        </label>
        <select
          name="meta_id"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
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
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 transition cursor-pointer"
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
