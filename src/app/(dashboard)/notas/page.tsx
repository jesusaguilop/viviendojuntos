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
    <div className="space-y-5 animate-slide-up">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-text">Mensajitos</h1>
        <p className="text-text-secondary text-xs md:text-sm mt-0.5">
          Déjense mensajes el uno al otro
        </p>
      </div>

      <form
        action={crearNota}
        className="bg-surface rounded-2xl border border-border p-4 md:p-5 space-y-3"
      >
        <label className="block text-sm font-medium text-text">
          Nuevo mensaje
        </label>
        <textarea
          name="contenido"
          rows={3}
          placeholder="Escribe algo para tu pareja..."
          required
          className="input-field resize-none"
        />
        <button type="submit" className="btn-primary w-full">
          Publicar mensaje
        </button>
      </form>

      <section className="space-y-3">
        {!notas || notas.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-8 md:p-12 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-secondary/30 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <p className="text-text-secondary text-lg font-medium">
              No hay mensajes todavía
            </p>
            <p className="text-text-secondary/60 text-sm mt-1">
              Escribe el primer mensaje
            </p>
          </div>
        ) : (
          notas.map((nota) => {
            const isMine = nota.usuario_id === user?.id;
            return (
              <div
                key={nota.id}
                className={`rounded-2xl border p-4 md:p-5 animate-fade-in ${
                  isMine
                    ? "bg-primary/5 border-primary/20 ml-4 md:ml-12"
                    : "bg-surface border-border mr-4 md:mr-12"
                }`}
              >
                <p className="text-text whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                  {nota.contenido}
                </p>
                <div className="flex items-center justify-between gap-3 mt-3">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <span className={`font-medium ${isMine ? "text-primary" : ""}`}>
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

                  {nota.usuario_id === user?.id && (
                    <form action={eliminarNota.bind(null, nota.id)}>
                      <button
                        type="submit"
                        className="w-7 h-7 rounded-full bg-danger/10 text-danger flex items-center justify-center text-sm font-bold hover:bg-danger/20 transition cursor-pointer"
                      >
                        ×
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
