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
        <h2 className="text-2xl font-extrabold text-text">Productos</h2>
      </div>

      <NuevaSeccionForm />

      {!secciones || secciones.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-10 text-center">
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
