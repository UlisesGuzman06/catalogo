# Catálogo de Servicios – Documentación del Proyecto

## Descripción General

Este proyecto es una **aplicación web** desarrollada para el **Gobierno de Mendoza** que muestra un catálogo de servicios de interoperabilidad basados en la plataforma **X-Road**. Permite a los usuarios explorar, buscar y filtrar los servicios disponibles, ver sus detalles técnicos y acceder a documentación asociada.

---

## Stack Tecnológico

| Tecnología                | Versión  | Propósito                         |
| ------------------------- | -------- | --------------------------------- |
| **Next.js**               | 16.1.1   | Framework React con SSR           |
| **React**                 | 19.2.3   | Librería de UI                    |
| **TypeScript**            | ^5       | Tipado estático                   |
| **Tailwind CSS**          | ^4       | Estilos utilitarios               |
| **Framer Motion**         | ^12.26.1 | Animaciones (modales)             |
| **Lucide React**          | ^0.562.0 | Iconografía                       |
| **clsx + tailwind-merge** | —        | Utilidad para merge de clases CSS |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css         # Variables CSS globales y utilidades (colores, contenedores)
│   ├── layout.tsx          # Layout raíz (fuente Inter, metadata, estructura HTML)
│   └── page.tsx            # Página principal (fetch de datos y render del catálogo)
├── components/
│   ├── Badge.tsx           # Badge reutilizable (success/error/default)
│   ├── Button.tsx          # Botón reutilizable (primary/secondary/outline/ghost)
│   ├── Header.tsx          # Encabezado institucional con logo del Gobierno de Mendoza
│   ├── PdfViewerButton.tsx # Botón inteligente para visualizar PDFs (múltiples estrategias)
│   ├── ServiceCard.tsx     # Tarjeta resumen de un servicio
│   ├── ServiceCatalog.tsx  # Componente principal: grilla de servicios con filtros y paginación
│   └── ServiceModal.tsx    # Modal de detalle de un servicio (3 tabs: General, Técnico, Respuesta)
└── lib/
    ├── api.ts              # Interfaz Service, funciones login() y getServices()
    └── utils.ts            # Función cn() para merge de clases CSS
```

---

## Flujo de Datos

1. **`page.tsx`** (Server Component) llama a `getServices()` en el servidor.
2. **`api.ts`** se autentica contra la API del portal EDI (`/authenticate/login`) obteniendo un JWT.
3. Con el token, consulta **`/api/CatalogoServicios`** y obtiene un array de `Service[]`.
4. Los datos se pasan como `initialServices` a **`ServiceCatalog`** (Client Component).
5. `ServiceCatalog` gestiona filtros, búsqueda y paginación del lado del cliente.

### API Base

```
https://certificados.mxm.mendoza.gov.ar/apiportaledi/api
```

### Endpoints utilizados

| Endpoint              | Método | Descripción                 |
| --------------------- | ------ | --------------------------- |
| `/authenticate/login` | POST   | Autenticación (retorna JWT) |
| `/CatalogoServicios`  | GET    | Lista completa de servicios |

---

## Modelo de Datos: `Service`

```typescript
interface Service {
  idServicio: number; // ID único del servicio
  idSubsistema: number; // ID del subsistema asociado
  memberName: string; // Nombre del organismo proveedor
  xRoadInstance: string; // Instancia X-Road
  memberClass: string; // Clase del miembro (ej: GOV)
  memberCode: string; // Código del miembro
  subsystemCode: string; // Código del subsistema
  serviceCode: string; // Código/nombre del servicio
  serviceVersion: string; // Versión del servicio
  serviceType: string; // Tipo (REST, SOAP, etc.)
  descripcion: string; // Descripción legible del servicio
  respuesta: string; // Ejemplo de respuesta JSON
  parametros: string; // Parámetros de entrada
  responsables: string; // Responsables del servicio
  habilitado: boolean; // true = Publicado, false = No Publicado
  nombreArchivoAdjunto: string; // URL del PDF adjunto
  endpointMethod: string; // Método HTTP
  endpointPath: string; // Path del endpoint
  urlDocumentacion: string | null; // URL de documentación técnica (OpenAPI)
  urlSolicitud: string | null; // URL del formulario de solicitud
  textoAlternativo: string; // Texto alternativo
}
```

---

## Componentes Principales

### `ServiceCatalog.tsx`

Componente central de la aplicación. Funcionalidades:

- **Filtro por Miembro**: Sidebar lateral con radio buttons que lista todos los miembros (organismos).
- **Búsqueda**: Campo de texto que busca por código de servicio, descripción o nombre de miembro.
- **Paginación**: Muestra **9 servicios por página** con controles de navegación (anterior, siguiente, números de página).
- **Contador**: Muestra cantidad de servicios publicados en el header.

### `ServiceCard.tsx`

Tarjeta que resume un servicio individual:

- Badge del subsistema y estado (Publicado/No Publicado)
- Clase del miembro, código del servicio, versión
- Descripción (limitada a 3 líneas)
- Tipo de servicio y botón "Ver detalle"

### `ServiceModal.tsx`

Modal con detalle completo organizado en **3 tabs**:

1. **General**: Descripción, datos del proveedor (organismo, código, clase) y links a documentación (formulario de solicitud, OpenAPI, PDF adjunto).
2. **Especificación Técnica**: Endpoint path y parámetros de entrada.
3. **Respuesta**: Ejemplo de respuesta JSON con botón de copiar al portapapeles.

### `PdfViewerButton.tsx`

Botón inteligente para abrir documentación PDF con **6 estrategias** de visualización:

- `anchor`: Link simple
- `window`: `window.open()` programático
- `blob`: Descarga via `fetch` + `Blob` (evita `Content-Disposition: attachment`)
- `modal`: Iframe en modal
- `google`: Google Docs Viewer en modal
- `smart` (default): Intenta `blob`, si falla hace fallback a `anchor`

---

## Tema Visual

Definido en `globals.css` con variables CSS:

| Variable                  | Valor     | Uso                      |
| ------------------------- | --------- | ------------------------ |
| `--color-primary`         | `#003366` | Color institucional azul |
| `--color-primary-hover`   | `#002855` | Hover del primario       |
| `--color-background`      | `#f5f5f5` | Fondo general            |
| `--color-text-main`       | `#1a202c` | Texto principal          |
| `--color-text-secondary`  | `#718096` | Texto secundario         |
| `--color-success-bg/text` | Verde     | Estado "Publicado"       |
| `--color-error-bg/text`   | Rojo      | Estado "No Publicado"    |
| `--color-border`          | `#e2e8f0` | Bordes                   |

---

## Comandos

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start

# Lint
npm run lint
```

---

## Variables de Entorno

| Variable       | Default          | Descripción                    |
| -------------- | ---------------- | ------------------------------ |
| `API_USER`     | `portaledi`      | Usuario para autenticación API |
| `API_PASSWORD` | `PortalEdi1945!` | Contraseña para autenticación  |

> **Nota**: En desarrollo, se deshabilita la validación SSL (`NODE_TLS_REJECT_UNAUTHORIZED=0`).
