import type { MetaConAportes } from "@/types";
import ProgressBar from "./ProgressBar";

export default function MetaCard({ meta }: { meta: MetaConAportes }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-text text-lg">{meta.nombre}</h3>
        <span className="text-sm font-semibold text-primary">
          ${meta.total_aportado.toLocaleString()} / ${meta.monto_objetivo.toLocaleString()}
        </span>
      </div>

      <ProgressBar
        porcentaje={meta.porcentaje}
        size="md"
      />

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
    </div>
  );
}
