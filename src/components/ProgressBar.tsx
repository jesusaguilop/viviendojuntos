export default function ProgressBar({
  porcentaje,
  size = "md",
  label,
}: {
  porcentaje: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const heights = { sm: "h-2", md: "h-3", lg: "h-4" };

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary font-medium">{label}</span>
          <span className="font-bold text-text">{porcentaje}%</span>
        </div>
      )}
      <div
        className={`w-full bg-secondary/50 rounded-full overflow-hidden ${heights[size]}`}
      >
        <div
          className={`${heights[size]} rounded-full transition-all duration-700 ease-out`}
          style={{
            width: `${Math.min(porcentaje, 100)}%`,
            background:
              porcentaje >= 100
                ? "linear-gradient(90deg, #7eb5a6, #6da394)"
                : porcentaje >= 50
                  ? "linear-gradient(90deg, #e8867b, #f4c6a9)"
                  : "linear-gradient(90deg, #f4c6a9, #e8867b)",
          }}
        />
      </div>
    </div>
  );
}
