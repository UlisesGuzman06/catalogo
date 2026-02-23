import { ServiceCard } from "@/components/ServiceCard";

export interface Service {
  idServicio: number;
  idSubsistema: number;
  memberName: string;
  xRoadInstance: string;
  memberClass: string;
  memberCode: string;
  subsystemCode: string;
  serviceCode: string;
  serviceVersion: string;
  serviceType: string;
  descripcion: string;
  respuesta: string;
  parametros: string;
  responsables: string;
  habilitado: boolean;
  nombreArchivoAdjunto: string;
  endpointMethod: string;
  endpointPath: string;
  urlDocumentacion: string | null;
  urlSolicitud: string | null;
  textoAlternativo: string;
}

const BASE_URL = "https://certificados.mxm.mendoza.gov.ar/apiportaledi/api";

// Para saltar validación SSL en desarrollo si es necesario (Nota: En Edge Runtime esto no funciona igual, pero en Node si)
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function login(): Promise<string | null> {
  // Credenciales provistas por el usuario
  const payload = {
    Username: process.env.API_USER || "portaledi",
    Password: process.env.API_PASSWORD || "PortalEdi1945!",
  };

  try {
    const res = await fetch(`${BASE_URL}/authenticate/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // Claves PascalCase requeridas por la API
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Error Login: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.token;
  } catch (error) {
    console.error("Error conexión login:", error);
    return null;
  }
}

export async function getServices(
  token?: string
): Promise<{ data: Service[]; error?: string }> {
  if (!token) {
    token = (await login()) || undefined;
  }

  if (!token) {
    return { data: [], error: "No se pudo autenticar con la API." };
  }

  try {
    const res = await fetch(`${BASE_URL}/CatalogoServicios`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache corto de 1 minuto
    });

    if (!res.ok) {
      console.error(`Error Catálogo: ${res.status}`);
      return { data: [], error: `Error API: ${res.status}` };
    }

    const data: Service[] = await res.json();
    return { data };
  } catch (error) {
    console.error("Error fetch servicios:", error);
    return { data: [], error: "Error de red al conectar con catálogo." };
  }
}

// Mantenemos mocks solo como referencia estructural o fallback extremo manual
export const MOCK_SERVICES: Service[] = [];
