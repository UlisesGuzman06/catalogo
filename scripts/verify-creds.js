// scripts/verify-creds.js
const https = require("https");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const BASE_URL = "https://certificados.mxm.mendoza.gov.ar/apiportaledi/api";
const CREDENTIALS = {
  Username: "portaledi",
  Password: "PortalEdi1945!",
};

async function postData(url, data) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(data); // PascalCase keys
    console.log("Enviando body:", dataString);

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

async function run() {
  console.log(`Intentando login con usuario: ${CREDENTIALS.Username}`);
  try {
    const res = await postData(`${BASE_URL}/authenticate/login`, CREDENTIALS);
    console.log("Status Code:", res.status);

    if (res.status === 200) {
      console.log("LOGIN EXITOSO!");
      const json = JSON.parse(res.body);
      console.log("Token recibido:", json.token ? "SI" : "NO");
      if (json.token) {
        console.log("Token sample:", json.token.substring(0, 50) + "...");
      }
    } else {
      console.log("LOGIN FALLIDO");
      console.log("Respuesta:", res.body);
    }
  } catch (e) {
    console.error("Error de red:", e);
  }
}

run();
