import { crearSeccion } from "@/app/actions/productos";

export default function NuevaSeccionForm() {
  return (
    <form
      action={crearSeccion}
      className="bg-surface rounded-2xl border border-border p-5 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="font-bold text-text">Nueva sección</h3>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          name="nombre"
          placeholder="Ej: Prioritario"
          required
          className="input-field flex-1"
        />
        <input
          type="number"
          name="orden"
          placeholder="Orden"
          className="input-field w-20"
        />
        <button
          type="submit"
          className="btn-accent"
        >
          Crear
        </button>
      </div>
    </form>
  );
}
