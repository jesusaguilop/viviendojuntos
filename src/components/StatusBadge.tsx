import type { AppStatus } from "@/types";

const estados: Record<AppStatus, { emoji: string; texto: string; color: string }> = {
  inicio: { emoji: "🚀", texto: "Ha comenzado", color: "bg-secondary/50 text-text" },
  ahorrando: { emoji: "🏠", texto: "Ahorrando", color: "bg-accent/20 text-accent" },
  cerca: { emoji: "💰", texto: "Cerca de la meta", color: "bg-primary/20 text-primary" },
  mudanza: { emoji: "🎉", texto: "¡Nos mudamos!", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

function calcularEstado(porcentaje: number): AppStatus {
  if (porcentaje >= 100) return "mudanza";
  if (porcentaje >= 50) return "cerca";
  if (porcentaje > 0) return "ahorrando";
  return "inicio";
}

export default function StatusBadge({ porcentaje }: { porcentaje: number }) {
  const estado = calcularEstado(porcentaje);
  const { emoji, texto, color } = estados[estado];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}
    >
      <span>{emoji}</span>
      <span>{texto}</span>
    </span>
  );
}
