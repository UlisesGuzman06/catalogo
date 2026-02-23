"use client";

import { Service } from "@/lib/api";
import { X, Copy, Check, ExternalLink } from "lucide-react";
import { PdfViewerButton } from "@/components/PdfViewerButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const [activeTab, setActiveTab] = useState<
    "general" | "tecnico" | "respuesta"
  >("general");
  const [copied, setCopied] = useState(false);

  if (!service) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 overflow-hidden" // Prevents body scroll
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-6xl h-[90vh] rounded-lg shadow-xl flex flex-col overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-start shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {service.serviceType}
                  </span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                    {service.subsystemCode}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-800 break-all leading-tight">
                  {service.serviceCode}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 px-6 flex space-x-6 shrink-0 bg-white sticky top-0">
              {["general", "tecnico", "respuesta"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "py-3 text-sm font-medium border-b-2 transition-colors capitalize",
                    activeTab === tab
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300",
                  )}
                >
                  {tab === "tecnico" ? "Especificación Técnica" : tab}
                </button>
              ))}
            </div>

            {/* Content Parsed based on Tab */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {activeTab === "general" && (
                <div className="max-w-4xl space-y-8">
                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">
                      Descripción
                    </h3>
                    <p className="text-base text-slate-700 leading-relaxed bg-white border border-slate-200 p-4 rounded-md shadow-sm">
                      {service.descripcion}
                    </p>
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm">
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 border-b border-slate-100 pb-2">
                        Detalles del Proveedor
                      </h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Organismo</dt>
                          <dd className="font-medium text-slate-900 text-right">
                            {service.memberName}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Código</dt>
                          <dd className="font-mono text-slate-600 bg-slate-100 px-1 rounded">
                            {service.memberCode}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Clase</dt>
                          <dd className="font-medium text-slate-900">
                            {service.memberClass}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm">
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 border-b border-slate-100 pb-2">
                        Acceso y Documentación
                      </h4>
                      <div className="space-y-3">
                        {service.urlSolicitud && (
                          <a
                            href={service.urlSolicitud}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="w-4 h-4" /> Formulario de
                            Solicitud
                          </a>
                        )}
                        {service.urlDocumentacion && (
                          <a
                            href={service.urlDocumentacion}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="w-4 h-4" /> Documentación
                            Técnica (OpenAPI)
                          </a>
                        )}
                        {service.nombreArchivoAdjunto ? (
                          <PdfViewerButton
                            url={service.nombreArchivoAdjunto}
                            label="Documentación Adjunta (PDF)"
                            strategy="smart"
                          />
                        ) : (
                          !service.urlDocumentacion && (
                            <span className="text-sm text-slate-400 italic">
                              Sin documentación adjunta
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "tecnico" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">
                      Endpoint (Path)
                    </h3>
                    <div className="bg-slate-800 text-slate-200 p-3 rounded-md font-mono text-xs break-all border border-slate-700">
                      {service.endpointPath ||
                        "No definido en metadata. Consultar documentación."}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">
                      Parámetros de Entrada
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-md p-0 overflow-hidden">
                      <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 text-xs text-slate-500 font-mono">
                        Raw Parameters Text
                      </div>
                      <pre className="p-4 text-sm font-mono text-slate-700 whitespace-pre-wrap overflow-x-auto max-h-[400px]">
                        {service.parametros}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "respuesta" && (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase">
                      Ejemplo de Respuesta (JSON)
                    </h3>
                    <button
                      onClick={() => copyToClipboard(service.respuesta)}
                      className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
                    >
                      {copied ? "Copiado" : "Copiar"}
                      {copied ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <div className="flex-1 bg-slate-900 rounded-md overflow-hidden border border-slate-700 flex flex-col">
                    <pre className="flex-1 p-4 text-xs font-mono text-green-400 overflow-auto whitespace-pre-wrap leading-relaxed">
                      {service.respuesta}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between">
              <span>Instancia X-Road: {service.xRoadInstance}</span>
              <span>Responsable: {service.responsables}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
