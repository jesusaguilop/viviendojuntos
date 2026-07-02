import { createClient } from "@/lib/supabase/server";
import AportesForm from "@/components/AportesForm";
import { eliminarAporte } from "@/app/actions/aportes";

export default async function AportesPage() {
  const supabase = await createClient();

  const { data: metas } = await supabase.from("metas").select("*");
  const { data: aportes } = await supabase
    .from("aportes")
    .select("*, profiles:usuario_id(nombre), metas:meta_id(nombre)")
    .order("fecha", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const totalAportado = aportes?.reduce((s, a) => s + Number(a.monto), 0) ?? 0;

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-extrabold text-text">Aportes</h1>
          <p className="text-text-secondary text-xs md:text-sm mt-0.5">
            Registra y sigue tus ahorros
          </p>
        </div>
        {totalAportado > 0 && (
          <div className="text-right shrink-0">
            <p className="text-base md:text-lg font-extrabold text-primary">
              ${totalAportado.toLocaleString("es-ES")}
            </p>
            <p className="text-[10px] md:text-xs text-text-secondary">total</p>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <AportesForm metas={metas ?? []} />
        </div>

        <div>
          <h2 className="font-bold text-text text-base md:text-lg mb-3">
            Historial
          </h2>

          {!aportes || aportes.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-border p-8 md:p-10 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary/30 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path d="M19 10v2a7 7 0 01-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </div>
              <p className="text-text-secondary text-base md:text-lg font-medium">
                Aún no hay aportes
              </p>
              <p className="text-text-secondary/60 text-xs md:text-sm mt-1">
                Usa el formulario para registrar tu primer aporte
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {aportes.map((a) => (
                <div
                  key={a.id}
                  className="bg-surface rounded-xl border border-border p-3 md:p-4 flex items-center justify-between gap-2 animate-fade-in hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary/30 flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                        <span className="font-bold text-text text-base md:text-lg">
                          ${Number(a.monto).toLocaleString("es-ES")}
                        </span>
                        <span className="text-[10px] md:text-xs bg-primary/10 text-primary px-1.5 md:px-2 py-0.5 rounded-full font-medium">
                          {a.metas?.nombre}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-text-secondary mt-0.5">
                        <span className="font-medium">{a.profiles?.nombre}</span>
                        <span>•</span>
                        <span>
                          {new Date(a.fecha).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        {a.nota && <span className="hidden md:inline">• &quot;{a.nota}&quot;</span>}
                      </div>
                    </div>
                  </div>

                  {a.usuario_id === user?.id && (
                    <form action={eliminarAporte.bind(null, a.id)}>
                      <button
                        type="submit"
                        className="w-7 h-7 rounded-full bg-danger/10 text-danger flex items-center justify-center text-sm font-bold hover:bg-danger/20 transition cursor-pointer shrink-0"
                      >
                        ×
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
