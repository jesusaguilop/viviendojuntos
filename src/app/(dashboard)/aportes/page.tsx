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
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Aportes</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            Registra y sigue tus ahorros
          </p>
        </div>
        {totalAportado > 0 && (
          <div className="text-right">
            <p className="text-lg font-extrabold text-primary">
              ${totalAportado.toLocaleString("es-ES")}
            </p>
            <p className="text-xs text-text-secondary">total ahorrado</p>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <AportesForm metas={metas ?? []} />
        </div>

        <div className="md:col-span-2">
          <section>
            <h2 className="font-bold text-text text-lg mb-3">
              Historial
            </h2>

            {!aportes || aportes.length === 0 ? (
              <div className="bg-surface rounded-2xl border border-border p-10 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-secondary/30 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </div>
                <p className="text-text-secondary text-lg font-medium">
                  Aún no hay aportes
                </p>
                <p className="text-text-secondary/60 text-sm mt-1">
                  Usa el formulario para registrar tu primer aporte
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {aportes.map((a) => (
                  <div
                    key={a.id}
                    className="bg-surface rounded-xl border border-border p-4 flex items-center justify-between gap-3 animate-fade-in hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-text text-lg">
                            ${Number(a.monto).toLocaleString("es-ES")}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            {a.metas?.nombre}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                          <span className="font-medium">{a.profiles?.nombre}</span>
                          <span>•</span>
                          <span>
                            {new Date(a.fecha).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          {a.nota && <span>• &quot;{a.nota}&quot;</span>}
                        </div>
                      </div>
                    </div>

                    {a.usuario_id === user?.id && (
                      <form action={eliminarAporte.bind(null, a.id)}>
                        <button
                          type="submit"
                          className="text-xs text-danger hover:underline cursor-pointer"
                        >
                          ×
                        </button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
