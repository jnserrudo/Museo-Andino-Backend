// Importamos las dependencias
import express, { json } from "express";
import cors from "cors";
//import { router } from "./src/routes/main.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path"; // Importa el módulo 'path'
const filename = fileURLToPath(import.meta.url);
const dirnamex = dirname(filename);
console.log("filename: ", filename, "dirnamex:", dirnamex);
// Configuración de la aplicación
const app = express();
app.disable("x-powered-by");

// Middleware para registrar los orígenes aceptados
const ACCEPTED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:1234",
  "http://localhost:5173",
  "http://localhost:5175",
  "http://moviesdea.com",
  "http://jnsix.com",
];

// Configuración del middleware CORS
app.use(
  cors({
    origin: "*" /* (origin, callback) => {
        // Permite solicitudes sin origen (por ejemplo, aplicaciones móviles)
        if (!origin) return callback(null, true);
        if (ACCEPTED_ORIGINS.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            return callback(new Error('No permitido por CORS'));
        }
    } */,
  })
);

// Proyecto 1: /museo
//Como hostear react directo desde express? Asi -->
//Primero le decimos a express que use todos los archivos del build de react asi:
const staticPath = path.join(dirnamex, "../Museo-Andino-Guia-Interactiva/museo-andino-guia-interactiva/dist");
console.log("Static Path: ", staticPath);

app.use(express.static(staticPath));

//Luego le decimos a express que sirva todo eso desde el home

const front = (req, res) => {
  console.log("ENTRO A front");
  const indexPath = path.join(staticPath, "index.html");
  console.log("Serving index.html from: ", indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      res.status(500).send(err);
    }
  });
};

// Middleware para analizar JSON
app.use(json());

// Rutas de la aplicación

//app.use("/api", router);

// Servir el frontend en la ruta raíz
app.get("/museo", front);

app.get("*", front);
// Manejar todas las demás rutas para React

/**
 * ¿Por qué se necesitan ambas?
Ruta raíz ("/"): Específicamente para cuando un usuario accede a la página principal. Aunque podrías depender
solo de app.get('*', front);, tener app.get("/", front); puede ser útil para optimización o claridad en el código.

Rutas no reconocidas ("*"): Captura todas las demás rutas, garantizando que el servidor siempre sirva index.html
para que React pueda manejar la navegación. Es esencial para aplicaciones SPA (Single Page Application), donde 
las rutas son manejadas por el frontend y no por el servidor.

En resumen, mientras que app.get("/", front); se asegura de que la ruta raíz funcione correctamente, 
app.get('*', front); garantiza que todas las demás rutas también sirvan la aplicación React, permitiendo que 
React Router maneje la navegación.
* 
*/



// =====================
// 🟣 Proyecto 2: /mra/guia_interactiva
// =====================
const staticPathMRA = path.join(dirnamex, "../Museo-Regional-Andino-Guia-Interactiva/dist");
console.log("Static Path MRA: ", staticPathMRA);

app.use("/mra/guia_interactiva", express.static(staticPathMRA));
app.get("/mra/guia_interactiva*", (req, res) => {
  res.sendFile(path.join(staticPathMRA, "index.html"));
});

//------------


// Manejo de errores CORS
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message);
    res.status(403).send("No permitido por CORS");
  } else {
    next();
  }
});

console.log(path.join(dirnamex, "uploads"));

// Servir archivos estáticos
//app.use("/uploads", express.static(path.join(dirnamex, "src", "uploads")));

const PORT = process.env.PORT ?? 2000;


app.get("*", front);


app.listen(PORT, () => {
  console.log("servidor escuchando en el puerto  http://localhost:2000");
});
