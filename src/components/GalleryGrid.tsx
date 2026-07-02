"use client";

import { useState } from "react";
import type { Foto } from "@/types";
import { eliminarFoto } from "@/app/actions/fotos";

export default function GalleryGrid({
  fotos,
  userId,
}: {
  fotos: Foto[];
  userId?: string;
}) {
  const [selected, setSelected] = useState<Foto | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {fotos.map((foto) => (
          <div
            key={foto.id}
            className="group relative bg-surface rounded-2xl border border-border overflow-hidden cursor-pointer animate-fade-in hover:shadow-lg transition-all"
            onClick={() => setSelected(foto)}
          >
            <div className="aspect-square">
              <img
                src={foto.url}
                alt={foto.descripcion ?? "Foto"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                {foto.descripcion && (
                  <p className="text-white text-sm font-medium truncate">
                    {foto.descripcion}
                  </p>
                )}
                <p className="text-white/70 text-xs mt-0.5">
                  {foto.profiles?.nombre}
                </p>
              </div>
            </div>
            {foto.usuario_id === userId && (
              <form
                action={eliminarFoto.bind(null, foto.id, foto.url)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="submit"
                  className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-sm hover:bg-danger transition cursor-pointer"
                >
                  ×
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.url}
              alt={selected.descripcion ?? "Foto"}
              className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain"
            />
            <div className="mt-3 flex items-center justify-between text-white">
              <div>
                {selected.descripcion && (
                  <p className="font-medium">{selected.descripcion}</p>
                )}
                <p className="text-sm text-white/70">
                  {selected.profiles?.nombre} · {new Date(selected.created_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
