import { useState } from "react";
import {
  ExternalLink,
  Loader2,
  Eye,
  Download,
  FileText,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PdfViewerButtonProps {
  url: string;
  label?: string;
  className?: string;
  /**
   * Estrategia de visualización:
   * - 'anchor': Link simple <a target="_blank"> (El navegador decide si descargar o abrir)
   * - 'window': window.open() (Programático, puede ser bloqueado por popups si no es via click directo)
   * - 'blob': Descarga via fetch, crea Blob y abre en nueva pestaña (Evita Content-Disposition: attachment si CORS lo permite)
   * - 'modal': Abre un modal con iframe (Mejor UX visual, pero depende de X-Frame-Options)
   * - 'smart': Intenta 'blob', si falla (CORS) hace fallback a 'anchor'
   * - 'google': Usa Google Docs Viewer en un modal (Bypassea CORS y descargas forzadas)
   */
  strategy?: "anchor" | "window" | "blob" | "modal" | "smart" | "google";
}

export function PdfViewerButton({
  url,
  label = "Ver Documentación",
  className,
  strategy = "smart",
}: PdfViewerButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleView = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Evitar cerrar modales padres si existen
    if (loading) return;

    // Estrategia: Modal (Iframe) o Google Viewer
    if (strategy === "modal" || strategy === "google") {
      setShowModal(true);
      return;
    }

    // Estrategia: Anchor simple (fallback manual)
    if (strategy === "anchor") {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    // Estrategia: Window Open directo
    if (strategy === "window") {
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write("Cargando vista previa...");
        newWindow.location.href = url;
      } else {
        alert("Por favor habilite los pop-ups para ver el documento.");
      }
      return;
    }

    // Estrategia: Blob / Smart
    try {
      setLoading(true);

      // Intentamos fetch para obtener el blob
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const blob = await response.blob();
      // Forzamos tipo PDF para que el navegador lo renderice
      const file = new Blob([blob], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      // Abrimos el Blob URL en nueva pestaña
      const newWindow = window.open(fileURL, "_blank");

      if (!newWindow) {
        alert("Por favor habilite los pop-ups para ver el documento.");
        // Si falla pop-up, tal vez queramos fallback a modal o download
      } else {
        // Limpieza automática tras un tiempo prudencial (ej. 5 min) para liberar memoria
        // No lo hacmos inmediatamente porque el usuario podría recargar la pestaña del blob
        setTimeout(() => URL.revokeObjectURL(fileURL), 300000);
      }
    } catch (error) {
      console.warn(
        "Aviso: No se pudo visualizar el PDF inline (posible bloqueo CORS). Se usará fallback.",
      );

      if (strategy === "smart") {
        // Fallback silencioso a abrir como link normal
        // Esto manejará casos donde el servidor no tiene CORS habilitado para nuestra app
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        alert(
          "No se pudo cargar la vista previa. Intente descargar el archivo.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Render simplificado si es solo anchor
  if (strategy === "anchor") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="w-4 h-4" />
        {label}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleView}
        disabled={loading}
        className={cn(
          "flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed group",
          className,
        )}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
        )}
        {label}
      </button>

      {/* Modal Viewer (Portal implícito por fixed/z-index) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full h-full max-w-6xl rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="w-4 h-4" />
                  <span
                    className="truncate max-w-[300px] sm:max-w-md"
                    title={label}
                  >
                    {label}
                  </span>
                </h3>
                <div className="flex items-center gap-2">
                  <a
                    href={url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700"
                    title="Descargar Original"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors text-slate-400"
                    title="Cerrar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Iframe Content */}
              <div className="flex-1 bg-slate-100 relative w-full h-full">
                <iframe
                  src={
                    strategy === "google"
                      ? `https://docs.google.com/gview?url=${encodeURIComponent(
                          url,
                        )}&embedded=true`
                      : url
                  }
                  className="w-full h-full border-0"
                  title="PDF Viewer"
                  allowFullScreen
                />
                {/* Overlay de carga simple si el iframe tarda */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
