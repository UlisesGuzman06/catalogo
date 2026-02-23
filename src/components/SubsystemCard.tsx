import { Badge } from "./Badge";
import { ChevronRight, Layers } from "lucide-react";

interface SubsystemCardProps {
  subsystemCode: string;
  memberName: string;
  serviceCount: number;
  availableCount: number;
  onClick: () => void;
}

export function SubsystemCard({
  subsystemCode,
  memberName,
  serviceCount,
  availableCount,
  onClick,
}: SubsystemCardProps) {
  const unavailableCount = serviceCount - availableCount;

  return (
    <div
      className="gov-card flex flex-col h-full overflow-hidden group hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <Badge
            label={subsystemCode}
            variant="default"
            className="bg-indigo-50 text-indigo-700 border border-indigo-200"
          />
          <div className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
            <Layers className="w-4 h-4 text-[var(--color-primary)]" />
            <strong className="text-[var(--color-text-main)]">
              {serviceCount}
            </strong>{" "}
            servicio{serviceCount !== 1 ? "s" : ""}
          </div>
        </div>

        <p className="text-xs text-[var(--color-text-secondary)] mb-3">
          Miembro: <span className="font-medium">{memberName}</span>
        </p>

        <div className="flex-grow" />

        <div className="flex items-center gap-2 mb-4">
          {availableCount > 0 && (
            <span className="text-xs bg-[var(--color-success-bg)] text-[var(--color-success-text)] px-2 py-0.5 rounded-full">
              {availableCount} disponible{availableCount !== 1 ? "s" : ""}
            </span>
          )}
          {unavailableCount > 0 && (
            <span className="text-xs bg-[var(--color-error-bg)] text-[var(--color-error-text)] px-2 py-0.5 rounded-full">
              {unavailableCount} no disponible
              {unavailableCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-end border-t border-[var(--color-border)] pt-4">
          <span className="text-sm font-medium text-[var(--color-primary)] group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Ver servicios
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
