"use client";

import { useState } from "react";
import { crearMeta } from "@/app/actions/metas";

export default function NuevaMetaForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await crearMeta(new FormData(e.currentTarget));
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setOpen(false), 1000);
    } catch {
      alert("Error al crear la meta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva meta
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-surface rounded-2xl border border-border p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-text text-lg">Crear meta de ahorro</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-text-secondary hover:text-text transition cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              required
              placeholder="Ej: Arriendo, Depósito, Muebles..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Monto objetivo ($)</label>
            <input
              type="number"
              name="monto_objetivo"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Descripción (opcional)</label>
            <textarea
              name="descripcion"
              rows={2}
              placeholder="¿Para qué es esta meta?"
              className="input-field resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? "Creando..." : "Crear meta"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-outline"
            >
              Cancelar
            </button>
          </div>

          {success && (
            <p className="text-accent text-sm text-center font-medium animate-fade-in">
              ¡Meta creada!
            </p>
          )}
        </form>
      )}
    </div>
  );
}
