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
      setTimeout(() => setOpen(false), 1200);
    } catch {
      alert("Error al crear la meta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-surface rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-text text-lg">Nueva meta</h3>
                  <p className="text-xs text-text-secondary">Crea una meta de ahorro</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-text-secondary hover:bg-secondary/50 transition cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-text mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    placeholder="Ej: Arriendo, Depósito..."
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
                  <label className="block text-sm font-medium text-text mb-1">Fecha límite</label>
                  <input
                    type="date"
                    name="fecha_limite"
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-text mb-1">Descripción (opcional)</label>
                  <textarea
                    name="descripcion"
                    rows={2}
                    placeholder="¿Para qué es esta meta?"
                    className="input-field resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
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
          </div>
        </div>
      )}
    </>
  );
}
