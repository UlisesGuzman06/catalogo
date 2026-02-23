import { Header } from "@/components/Header";
import ServiceCatalog from "@/components/ServiceCatalog";
import { getServices } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data, error } = await getServices();

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans flex flex-col">
      <Header />

      <main className="flex-1 gov-container w-full mx-auto">
        {error ? (
          <div className="mt-8 bg-white border-l-4 border-[var(--color-error-bg)] shadow-sm p-4 rounded-r-md">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-[var(--color-error-text)]">
                  Error de comunicación con el servidor
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ServiceCatalog initialServices={data} />
        )}
      </main>

      <footer className="mt-auto py-8 border-t border-[var(--color-border)] bg-white">
        <div className="gov-container text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            &copy; {new Date().getFullYear()} Gobierno de Mendoza. Todos los
            derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
