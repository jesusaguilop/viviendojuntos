import { createClient } from "@/lib/supabase/server";
import ProgressBar from "@/components/ProgressBar";
import MetaCard from "@/components/MetaCard";
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
    <div className="space-y-6 animate-slide-up">
      <section className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="text-xl font-extrabold text-text mb-4">
          Progreso global
        </h2>

        <ProgressBar
          porcentaje={porcentajeGlobal}
          size="lg"
          label="Ahorro total"
        />

        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="bg-bg rounded-xl p-3">
            <p className="text-2xl font-extrabold text-primary">
              ${totalAportado.toLocaleString()}
            </p>
            <p className="text-xs text-text-secondary font-medium">
              Ahorrado
            </p>
          </div>
          <div className="bg-bg rounded-xl p-3">
            <p className="text-2xl font-extrabold text-accent">
              ${falta > 0 ? falta.toLocaleString() : "0"}
            </p>
            <p className="text-xs text-text-secondary font-medium">
              {falta > 0 ? "Falta" : "¡Meta cumplida!"}
            </p>
          </div>
        </div>
      </section>

      {metasConAportes.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-10 text-center">
          <p className="text-text-secondary text-lg font-medium">
            Aún no hay metas de ahorro
          </p>
          <p className="text-text-secondary/60 text-sm mt-1">
            Crea una meta desde Supabase para empezar
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {metasConAportes.map((meta) => (
            <MetaCard key={meta.id} meta={meta} />
          ))}
        </div>
      )}
    </div>
  );
}
