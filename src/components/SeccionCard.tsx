"use client";

import { useState } from "react";
import type { Seccion, Producto } from "@/types";
import {
  crearProducto,
  eliminarSeccion,
  eliminarProducto,
  actualizarEstadoProducto,
  editarProducto,
} from "@/app/actions/productos";

export default function SeccionCard({
  seccion,
  productos,
}: {
  seccion: Seccion;
  productos: Producto[];
}) {
  const [expanded, setExpanded] = useState(true);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const estadoColors: Record<string, string> = {
    pendiente: "bg-secondary/50 text-text",
    ahorrando: "bg-accent/20 text-accent",
    comprado: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden animate-fade-in hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between p-3 md:p-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 md:gap-2 cursor-pointer min-h-[44px]"
        >
          <svg
            className={`transition-transform ${expanded ? "rotate-90" : ""} text-text-secondary shrink-0`}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <h3 className="font-bold text-text text-base md:text-lg">{seccion.nombre}</h3>
          <span className="text-[10px] md:text-xs text-text-secondary bg-bg px-1.5 md:px-2 py-0.5 rounded-full">
            {productos.length}
          </span>
        </button>

        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            onClick={() => setShowNewProduct(!showNewProduct)}
            className="btn-primary text-xs md:text-sm py-1.5 md:py-2 px-2.5 md:px-3 min-h-[36px]"
          >
            + Producto
          </button>
          <form action={eliminarSeccion.bind(null, seccion.id)}>
            <button
              type="submit"
              className="text-xs text-danger hover:underline cursor-pointer min-h-[36px]"
            >
              Eliminar
            </button>
          </form>
        </div>
      </div>

      {showNewProduct && (
        <form
          action={async (fd) => {
            fd.set("seccion_id", seccion.id);
            await crearProducto(fd);
            setShowNewProduct(false);
          }}
          className="px-3 md:px-4 pb-3 md:pb-4 space-y-2 border-b border-border"
        >
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del producto"
              required
              className="input-field text-sm"
            />
            <input
              type="number"
              name="precio_estimado"
              step="0.01"
              placeholder="Precio estimado"
              className="input-field text-sm"
            />
          </div>
          <button type="submit" className="btn-accent w-full text-sm">
            Guardar producto
          </button>
        </form>
      )}

      {expanded && productos.length > 0 && (
        <div className="divide-y divide-border">
          {productos.map((producto) => (
            <div key={producto.id} className="p-3 md:p-4 hover:bg-bg/50 transition">
              {editingId === producto.id ? (
                <EditProductForm producto={producto} onDone={() => setEditingId(null)} />
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text text-sm md:text-base">{producto.nombre}</p>
                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-text-secondary mt-0.5 flex-wrap">
                      {producto.precio_estimado !== null && (
                        <span>Est: ${Number(producto.precio_estimado).toLocaleString("es-ES")}</span>
                      )}
                      {producto.precio_real !== null && (
                        <span>Real: ${Number(producto.precio_real).toLocaleString("es-ES")}</span>
                      )}
                      {producto.notas && (
                        <span className="italic truncate max-w-[120px] md:max-w-none">&quot;{producto.notas}&quot;</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 md:gap-2 shrink-0">
                    <form
                      action={actualizarEstadoProducto.bind(null, producto.id, rotarEstado(producto.estado))}
                    >
                      <button
                        type="submit"
                        className={`text-[10px] md:text-xs px-2 md:px-3 py-1 rounded-full font-medium cursor-pointer min-h-[32px] ${estadoColors[producto.estado]}`}
                      >
                        {producto.estado}
                      </button>
                    </form>

                    <button
                      onClick={() => setEditingId(producto.id)}
                      className="text-xs text-text-secondary hover:text-primary transition cursor-pointer min-h-[32px]"
                    >
                      Editar
                    </button>

                    <form action={eliminarProducto.bind(null, producto.id)}>
                      <button
                        type="submit"
                        className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-danger/10 text-danger flex items-center justify-center text-xs md:text-sm font-bold hover:bg-danger/20 transition cursor-pointer"
                      >
                        ×
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {expanded && productos.length === 0 && (
        <div className="p-4 text-center text-sm text-text-secondary">
          Sin productos todavía
        </div>
      )}
    </div>
  );
}

function rotarEstado(actual: string): string {
  const ciclos: Record<string, string> = {
    pendiente: "ahorrando",
    ahorrando: "comprado",
    comprado: "pendiente",
  };
  return ciclos[actual] ?? "pendiente";
}

function EditProductForm({
  producto,
  onDone,
}: {
  producto: Producto;
  onDone: () => void;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await editarProducto(producto.id, new FormData(e.currentTarget));
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          name="nombre"
          defaultValue={producto.nombre}
          required
          className="input-field text-sm"
        />
        <input
          type="number"
          name="precio_estimado"
          step="0.01"
          defaultValue={producto.precio_estimado ?? ""}
          placeholder="Precio estimado"
          className="input-field text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select name="estado" defaultValue={producto.estado} className="input-field text-sm">
          <option value="pendiente">Pendiente</option>
          <option value="ahorrando">Ahorrando</option>
          <option value="comprado">Comprado</option>
        </select>
        <input
          type="number"
          name="precio_real"
          step="0.01"
          defaultValue={producto.precio_real ?? ""}
          placeholder="Precio real"
          className="input-field text-sm"
        />
      </div>
      <input
        type="text"
        name="notas"
        defaultValue={producto.notas ?? ""}
        placeholder="Notas del producto"
        className="input-field text-sm"
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-accent flex-1 text-sm">
          Guardar
        </button>
        <button type="button" onClick={onDone} className="btn-outline text-sm">
          Cancelar
        </button>
      </div>
    </form>
  );
}
