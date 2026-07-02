import { createClient } from "@/lib/supabase/server";
import { crearNota, eliminarNota } from "@/app/actions/notas";

export default async function NotasPage() {
  const supabase = await createClient();

  const { data: notas } = await supabase
    .from("notas")
    .select("*, profiles:usuario_id(nombre)")
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-2xl font-extrabold text-text">Mensajitos</h2>

      <form
        action={crearNota}
        className="bg-surface rounded-2xl border border-border p-5 space-y-3"
      >
        <textarea
          name="contenido"
          rows={3}
          placeholder="Escribe algo para tu pareja..."
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
        />
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition cursor-pointer"
        >
          Publicar mensaje
        </button>
      </form>

      <section className="space-y-3">
        {!notas || notas.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-10 text-center">
            <p className="text-text-secondary text-lg font-medium">
              No hay mensajes todavía
            </p>
            <p className="text-text-secondary/60 text-sm mt-1">
              Escribe el primer mensaje
            </p>
          </div>
        ) : (
          notas.map((nota) => (
            <div
              key={nota.id}
              className="bg-surface rounded-2xl border border-border p-5 animate-fade-in"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-text whitespace-pre-wrap">
                    {nota.contenido}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary">
                    <span className="font-medium">
                      {nota.profiles?.nombre}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(nota.created_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {nota.usuario_id === user?.id && (
                  <form action={eliminarNota.bind(null, nota.id)}>
                    <button
                      type="submit"
                      className="text-xs text-danger hover:underline cursor-pointer"
                    >
                      ×
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
