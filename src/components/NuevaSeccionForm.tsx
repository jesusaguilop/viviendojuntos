import { crearSeccion } from "@/app/actions/productos";

export default function NuevaSeccionForm() {
  return (
    <form
      action={crearSeccion}
      className="bg-surface rounded-2xl border border-border p-5 space-y-3"
    >
      <h3 className="font-bold text-text">Nueva sección</h3>
      <div className="flex gap-2">
        <input
          type="text"
          name="nombre"
          placeholder="Ej: Prioritario"
          required
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
        <input
          type="number"
          name="orden"
          placeholder="Orden"
          className="w-20 px-3 py-2.5 rounded-xl border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition cursor-pointer"
        >
          Crear
        </button>
      </div>
    </form>
  );
}
