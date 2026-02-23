// scripts/test-api.js
const https = require("https");

// Ignorar errores de certificado auto-firmado si los hubiera (común en internos)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const BASE_URL = "https://certificados.mxm.mendoza.gov.ar/apiportaledi/api";
// Intentamos auth por defecto
const USER = process.env.API_USER || "guest";
const PASS = process.env.API_PASSWORD || "guest";

/*
  NOTA: Si el endpoint no requiere auth real pero si un token, 
  probaremos si el login devuelve un token incluso con credenciales dummy.
*/

async function postData(url, data) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(data);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": dataString.length,
      },
    };

    const req = https.request(url, options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: body }));
    });

    req.on("error", (e) => reject(e));
    req.write(dataString);
    req.end();
  });
}

async function getData(url, token) {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(url, options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: body }));
    });

    req.on("error", (e) => reject(e));
    req.end();
  });
}

async function run() {
  console.log("--- 1. Login ---");
  console.log(`Intentando login en: ${BASE_URL}/authenticate/login`);

  // Intento 1: Con body vacío si el usuario dijo que "no necesita credenciales"
  // pero curl falló con 400 antes, asi que probemos con strings vacíos o dummy
  try {
    const loginRes = await postData(`${BASE_URL}/authenticate/login`, {
      username: USER,
      password: PASS,
    });
    console.log("Status Login:", loginRes.status);

    let token = null;
    if (loginRes.status === 200) {
      const json = JSON.parse(loginRes.body);
      token = json.token;
      console.log(
        "Token obtenido (primeros 20 chars):",
        token ? token.substring(0, 20) + "..." : "NULL"
      );
    } else {
      console.log("Respuesta Login:", loginRes.body);
      console.log(
        "FATAL: No se pudo obtener token. La API requiere un usuario válido."
      );
      return;
    }

    console.log("\n--- 2. Obtener Catalogo ---");
    const catRes = await getData(`${BASE_URL}/CatalogoServicios`, token);
    console.log("Status Catalogo:", catRes.status);

    if (catRes.status === 200) {
      const services = JSON.parse(catRes.body);
      console.log(`Exito! Se encontraron ${services.length} servicios.`);
      if (services.length > 0) {
        console.log("Ejemplo del primer servicio (Estructura completa):");
        console.log(JSON.stringify(services[0], null, 2));
      }
    } else {
      console.log("Error body:", catRes.body);
    }
  } catch (e) {
    console.error("Error ejecutando script:", e);
  }
}

run();
