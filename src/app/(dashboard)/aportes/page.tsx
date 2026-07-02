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

  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-2xl font-extrabold text-text">Aportes</h2>

      <AportesForm metas={metas ?? []} />

      <section>
        <h3 className="font-bold text-text text-lg mb-3">
          Historial de aportes
        </h3>

        {!aportes || aportes.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-8 text-center">
            <p className="text-text-secondary">Aún no hay aportes</p>
          </div>
        ) : (
          <div className="space-y-2">
            {aportes.map((a) => (
              <div
                key={a.id}
                className="bg-surface rounded-xl border border-border p-4 flex items-center justify-between gap-3 animate-fade-in"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-text">
                      ${Number(a.monto).toLocaleString()}
                    </span>
                    <span className="text-xs bg-secondary/50 text-text px-2 py-0.5 rounded-full font-medium">
                      {a.metas?.nombre}
                    </span>
                    <span className="text-xs text-text-secondary font-medium">
                      por {a.profiles?.nombre}
                    </span>
                  </div>
                  {a.nota && (
                    <p className="text-sm text-text-secondary mt-1">
                      {a.nota}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-text-secondary">
                    {new Date(a.fecha).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>

                  {a.usuario_id === user?.id && (
                    <form action={eliminarAporte.bind(null, a.id)}>
                      <button
                        type="submit"
                        className="text-xs text-danger hover:underline cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
