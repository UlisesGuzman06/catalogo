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

const BASE_URL = process.env.API_BASE_URL;

// Para saltar validación SSL en desarrollo
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function login(): Promise<string | null> {
  if (!BASE_URL || !process.env.API_USER || !process.env.API_PASSWORD) {
    console.error(
      "Error: Variables de entorno API_BASE_URL, API_USER y API_PASSWORD son requeridas. Verificá el archivo .env",
    );
    return null;
  }

  const payload = {
    Username: process.env.API_USER,
    Password: process.env.API_PASSWORD,
  };

  try {
    const res = await fetch(`${BASE_URL}/authenticate/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
  token?: string,
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
      next: { revalidate: 60 },
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

export const MOCK_SERVICES: Service[] = [];
