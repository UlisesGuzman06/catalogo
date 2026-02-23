import { Service } from "@/lib/api";
import { Badge } from "./Badge";
import { Button } from "./Button";

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  // Determine status variant
  const statusVariant = service.habilitado ? "success" : "error";
  const statusLabel = service.habilitado ? "Publicado" : "No Publicado";

  return (
    <div className="gov-card flex flex-col h-full overflow-hidden group hover:shadow-md transition-shadow">
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <Badge
            label={service.subsystemCode}
            variant="default"
            className="bg-gray-100 text-gray-700 border border-gray-200"
          />
          <Badge label={statusLabel} variant={statusVariant} />
        </div>

        <div className="mb-2">
          <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
            {service.memberClass}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-1 leading-tight line-clamp-2">
          {service.serviceCode}
        </h3>

        <p className="text-xs text-[var(--color-text-secondary)] mb-3">
          {service.memberName}
        </p>

        <p className="text-sm text-[var(--color-text-secondary)] mb-4 flex-grow line-clamp-3">
          {service.descripcion}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border)] pt-4">
          <span className="text-sm font-medium text-[var(--color-text-main)]">
            {service.serviceType}
          </span>
          <Button variant="primary" size="sm" onClick={() => onClick(service)}>
            Ver detalle
          </Button>
        </div>
      </div>
    </div>
  );
}
