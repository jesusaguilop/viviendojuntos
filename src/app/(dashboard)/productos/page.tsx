import { createClient } from "@/lib/supabase/server";
import SeccionCard from "@/components/SeccionCard";
import NuevaSeccionForm from "@/components/NuevaSeccionForm";

export default async function ProductosPage() {
  const supabase = await createClient();

  const { data: secciones } = await supabase
    .from("secciones")
    .select("*")
    .order("orden", { ascending: true });

  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: true });

  const productosPorSeccion: Record<string, NonNullable<typeof productos>> = {};
  productos?.forEach((p) => {
    if (!productosPorSeccion[p.seccion_id]) {
      productosPorSeccion[p.seccion_id] = [];
    }
    productosPorSeccion[p.seccion_id]!.push(p);
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Productos</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            Organiza lo que necesitan comprar
          </p>
        </div>
      </div>

      <NuevaSeccionForm />

      {!secciones || secciones.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-secondary/30 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-text-secondary text-lg font-medium">
            No hay secciones todavía
          </p>
          <p className="text-text-secondary/60 text-sm mt-1">
            Crea una sección para empezar a agregar productos
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {secciones.map((seccion) => (
            <SeccionCard
              key={seccion.id}
              seccion={seccion}
              productos={productosPorSeccion[seccion.id] ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
