import { Badge } from "./Badge";
import { Users, Server, ChevronRight } from "lucide-react";

interface MemberCardProps {
  memberName: string;
  memberClass: string;
  memberCode: string;
  subsystemCount: number;
  serviceCount: number;
  availableCount: number;
  onClick: () => void;
}

export function MemberCard({
  memberName,
  memberClass,
  memberCode,
  subsystemCount,
  serviceCount,
  availableCount,
  onClick,
}: MemberCardProps) {
  const unavailableCount = serviceCount - availableCount;

  return (
    <div
      className="gov-card flex flex-col h-full overflow-hidden group hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <Badge
            label={memberClass}
            variant="default"
            className="bg-blue-50 text-blue-700 border border-blue-200"
          />
          <span className="text-xs font-mono text-[var(--color-text-secondary)] bg-gray-100 px-2 py-0.5 rounded">
            {memberCode}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-3 leading-tight line-clamp-2">
          {memberName}
        </h3>

        <div className="flex-grow" />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Server className="w-4 h-4 text-[var(--color-primary)]" />
            <span>
              <strong className="text-[var(--color-text-main)]">
                {subsystemCount}
              </strong>{" "}
              subsistema{subsystemCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Users className="w-4 h-4 text-[var(--color-primary)]" />
            <span>
              <strong className="text-[var(--color-text-main)]">
                {serviceCount}
              </strong>{" "}
              servicio{serviceCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

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
            Ver subsistemas
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
