"use client";

import { Service } from "@/lib/api";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceModal } from "@/components/ServiceModal";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/Badge";

const PAGE_SIZE = 9;

interface ServiceCatalogProps {
  initialServices: Service[];
}

export default function ServiceCatalog({
  initialServices,
}: ServiceCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedMember, setSelectedMember] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedMember]);

  const members = useMemo(() => {
    const names = new Set(initialServices.map((s) => s.memberName));
    return ["todos", ...Array.from(names).sort()];
  }, [initialServices]);

  const filteredServices = useMemo(() => {
    const term = search.toLowerCase();
    return initialServices.filter((s) => {
      const matchesSearch =
        s.serviceCode.toLowerCase().includes(term) ||
        s.descripcion.toLowerCase().includes(term) ||
        s.memberName.toLowerCase().includes(term);

      const matchesMember =
        selectedMember === "todos" || s.memberName === selectedMember;

      return matchesSearch && matchesMember;
    });
  }, [initialServices, search, selectedMember]);

  // Count published services
  const publishedCount = initialServices.filter((s) => s.habilitado).length;

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / PAGE_SIZE),
  );
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8 items-start">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0 space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--color-border)] sticky top-24">
          <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
            Filtros
          </h2>

          <div className="space-y-6">
            {/* Search Input */}
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-main)] mb-2">
                Búsqueda
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar servicios..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-gray-400 text-[var(--color-text-main)]"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Members Filter */}
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-main)] mb-2">
                Miembro
              </h3>
              <div className="space-y-2 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                {members.map((member) => (
                  <label
                    key={member}
                    className="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="member"
                      checked={selectedMember === member}
                      onChange={() => setSelectedMember(member)}
                      className="rounded-full border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="capitalize">
                      {member === "todos" ? "Todos los miembros" : member}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <div className="text-xs text-[var(--color-text-secondary)] text-center">
                Mostrando {(currentPage - 1) * PAGE_SIZE + 1}-
                {Math.min(currentPage * PAGE_SIZE, filteredServices.length)} de{" "}
                {filteredServices.length} servicios
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Grid Content */}
      <div className="flex-1 w-full min-w-0">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--color-border)] mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-main)]">
              Catálogo de Servicios
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              <strong className="text-[var(--color-text-main)]">
                {publishedCount}
              </strong>{" "}
              servicios publicados
            </p>
          </div>
          <Badge
            label={`${filteredServices.length} Resultados`}
            variant="default"
            className="text-sm px-3 py-1"
          />
        </div>

        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white border border-[var(--color-border)] rounded-lg text-center shadow-sm">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-[var(--color-text-main)] font-semibold text-lg mb-2">
              No se encontraron servicios
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-xs mx-auto">
              Intenta ajustar tus filtros de búsqueda o prueba con otros
              términos.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedMember("todos");
              }}
              className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedServices.map((service) => (
              <ServiceCard
                key={service.idServicio}
                service={service}
                onClick={setSelectedService}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first, last, current, and neighbors
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .reduce<(number | string)[]>((acc, page, idx, arr) => {
                if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                  acc.push("...");
                }
                acc.push(page);
                return acc;
              }, [])
              .map((item, idx) =>
                typeof item === "string" ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-sm text-[var(--color-text-secondary)]"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setCurrentPage(item)}
                    className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item
                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                        : "bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}
