import type { MetaConAportes } from "@/types";
import ProgressBar from "./ProgressBar";
import { eliminarMeta } from "@/app/actions/metas";

export default function MetaCard({ meta }: { meta: MetaConAportes }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5 animate-fade-in hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-text text-lg">{meta.nombre}</h3>
          {meta.descripcion && (
            <p className="text-xs text-text-secondary mt-0.5">{meta.descripcion}</p>
          )}
        </div>
        <div className="text-right shrink-0 ml-2">
          <span className="font-bold text-primary">
            ${meta.total_aportado.toLocaleString()}
          </span>
          <span className="text-text-secondary text-xs block">
            de ${meta.monto_objetivo.toLocaleString()}
          </span>
        </div>
      </div>

      <ProgressBar porcentaje={meta.porcentaje} size="md" />

      {Object.keys(meta.aportes_usuario).length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs font-medium text-text-secondary mb-2">
            Aportes por persona
          </p>
          <div className="space-y-1.5">
            {Object.entries(meta.aportes_usuario).map(([nombre, monto]) => (
              <div key={nombre} className="flex items-center justify-between text-sm">
                <span className="font-medium text-text">{nombre}</span>
                <span className="text-text-secondary">
                  ${monto.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form action={eliminarMeta.bind(null, meta.id)} className="mt-3 pt-2 border-t border-border">
        <button
          type="submit"
          className="text-xs text-danger hover:underline cursor-pointer"
        >
          Eliminar meta
        </button>
      </form>
    </div>
  );
}
