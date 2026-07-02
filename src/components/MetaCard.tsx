import type { MetaConAportes } from "@/types";
import ProgressBar from "./ProgressBar";
import { eliminarMeta } from "@/app/actions/metas";

export default function MetaCard({ meta }: { meta: MetaConAportes }) {
  const diasRestantes = meta.fecha_limite
    ? Math.ceil(
        (new Date(meta.fecha_limite).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <div className="bg-surface rounded-2xl border border-border p-4 md:p-5 animate-fade-in hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-text text-base md:text-lg truncate">{meta.nombre}</h3>
          {meta.descripcion && (
            <p className="text-xs text-text-secondary mt-0.5 truncate">{meta.descripcion}</p>
          )}
          {diasRestantes !== null && (
            <p className={`text-xs font-medium mt-1 ${diasRestantes <= 0 ? "text-danger" : diasRestantes <= 30 ? "text-warning" : "text-accent"}`}>
              {diasRestantes <= 0
                ? "Fecha límite pasada"
                : `${diasRestantes} días`}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <span className="font-bold text-primary text-sm md:text-base">
            ${meta.total_aportado.toLocaleString("es-ES")}
          </span>
          <span className="text-text-secondary text-[10px] md:text-xs block">
            de ${meta.monto_objetivo.toLocaleString("es-ES")}
          </span>
          {meta.fecha_limite && (
            <span className="text-text-secondary text-[10px] block mt-0.5">
              {new Date(meta.fecha_limite).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
        </div>
      </div>

      <ProgressBar porcentaje={meta.porcentaje} size="md" />

      {Object.keys(meta.aportes_usuario).length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-[10px] md:text-xs font-medium text-text-secondary mb-1.5">
            Aportes por persona
          </p>
          <div className="space-y-1">
            {Object.entries(meta.aportes_usuario).map(([nombre, monto]) => (
              <div key={nombre} className="flex items-center justify-between text-xs md:text-sm">
                <span className="font-medium text-text">{nombre}</span>
                <span className="text-text-secondary">
                  ${monto.toLocaleString("es-ES")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form action={eliminarMeta.bind(null, meta.id)} className="mt-3 pt-2 border-t border-border">
        <button
          type="submit"
          className="text-xs text-danger hover:underline cursor-pointer min-h-[32px]"
        >
          Eliminar meta
        </button>
      </form>
    </div>
  );
}
