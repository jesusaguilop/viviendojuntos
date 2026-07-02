import { createClient } from "@/lib/supabase/server";
import ProgressBar from "@/components/ProgressBar";
import MetaCard from "@/components/MetaCard";
import NuevaMetaForm from "@/components/NuevaMetaForm";
import type { MetaConAportes } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: metas } = await supabase.from("metas").select("*");
  const { data: aportes } = await supabase
    .from("aportes")
    .select("*, profiles:usuario_id(nombre, avatar_color), metas:meta_id(nombre)");
  const { data: perfiles } = await supabase.from("profiles").select("*");

  const totalObjetivo =
    metas?.reduce((s, m) => s + Number(m.monto_objetivo), 0) ?? 0;
  const totalAportado =
    aportes?.reduce((s, a) => s + Number(a.monto), 0) ?? 0;
  const porcentajeGlobal =
    totalObjetivo > 0
      ? Math.min(Math.round((totalAportado / totalObjetivo) * 100), 100)
      : 0;

  const metasConAportes: MetaConAportes[] =
    metas?.map((meta) => {
      const aportesMeta = aportes?.filter((a) => a.meta_id === meta.id) ?? [];
      const totalMeta = aportesMeta.reduce((s, a) => s + Number(a.monto), 0);
      const porcentajeMeta =
        meta.monto_objetivo > 0
          ? Math.min(
              Math.round((totalMeta / Number(meta.monto_objetivo)) * 100),
              100,
            )
          : 0;

      const aportesUsuario: Record<string, number> = {};
      aportesMeta.forEach((a) => {
        const nombre = a.profiles?.nombre ?? "Unknown";
        aportesUsuario[nombre] =
          (aportesUsuario[nombre] ?? 0) + Number(a.monto);
      });

      return {
        ...meta,
        monto_objetivo: Number(meta.monto_objetivo),
        total_aportado: totalMeta,
        porcentaje: porcentajeMeta,
        aportes_usuario: aportesUsuario,
      };
    }) ?? [];

  const falta = totalObjetivo - totalAportado;

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-extrabold text-text truncate">
            Nuestro progreso
          </h1>
          <p className="text-text-secondary text-xs md:text-sm mt-0.5 truncate">
            {perfiles?.length === 2
              ? `${perfiles[0]?.nombre} y ${perfiles[1]?.nombre}`
              : "Ahorrando juntos"}
          </p>
        </div>
        <div className="shrink-0">
          <NuevaMetaForm />
        </div>
      </div>

      <section className="bg-gradient-to-br from-primary/5 via-surface to-accent/5 rounded-2xl border border-border p-4 md:p-6">
        <h2 className="text-base md:text-xl font-extrabold text-text mb-3 md:mb-4 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          Progreso global
        </h2>

        <ProgressBar porcentaje={porcentajeGlobal} size="lg" label="Ahorro total" />

        <div className="mt-3 md:mt-4 grid grid-cols-3 gap-2 md:gap-4 text-center">
          <div className="bg-surface rounded-xl p-2 md:p-3 border border-border">
            <p className="text-lg md:text-2xl font-extrabold text-primary truncate">
              ${totalAportado.toLocaleString("es-ES")}
            </p>
            <p className="text-[10px] md:text-xs text-text-secondary font-medium">
              Ahorrado
            </p>
          </div>
          <div className="bg-surface rounded-xl p-2 md:p-3 border border-border">
            <p className="text-lg md:text-2xl font-extrabold text-accent truncate">
              ${totalObjetivo.toLocaleString("es-ES")}
            </p>
            <p className="text-[10px] md:text-xs text-text-secondary font-medium">
              Meta total
            </p>
          </div>
          <div className="bg-surface rounded-xl p-2 md:p-3 border border-border">
            <p className="text-lg md:text-2xl font-extrabold truncate" style={{ color: falta > 0 ? "var(--color-warning)" : "var(--color-success)" }}>
              {falta > 0 ? `$${falta.toLocaleString("es-ES")}` : "¡Meta!"}
            </p>
            <p className="text-[10px] md:text-xs text-text-secondary font-medium">
              {falta > 0 ? "Falta" : "Cumplida"}
            </p>
          </div>
        </div>

        {perfiles && perfiles.length > 0 && (
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border flex items-center justify-center gap-4 md:gap-6">
            {perfiles.map((p) => (
              <div key={p.id} className="flex items-center gap-1.5 md:gap-2">
                <div
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-[10px] md:text-sm font-bold shadow-sm"
                  style={{ backgroundColor: p.avatar_color }}
                >
                  {p.nombre.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs md:text-sm font-medium text-text">{p.nombre}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {metasConAportes.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-8 md:p-12 text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-secondary/30 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <p className="text-text-secondary text-base md:text-lg font-medium">
            Aún no hay metas de ahorro
          </p>
          <p className="text-text-secondary/60 text-xs md:text-sm mt-1">
            Crea tu primera meta para empezar a ahorrar juntos
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:gap-4">
          {metasConAportes.map((meta) => (
            <MetaCard key={meta.id} meta={meta} />
          ))}
        </div>
      )}
    </div>
  );
}
