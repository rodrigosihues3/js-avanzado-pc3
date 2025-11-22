// Importa y ejecuta la configuración de dotenv para cargar variables de entorno desde un archivo .env.
import 'dotenv/config';
// Framework principal para la creación del servidor y la gestión de rutas.
import express from 'express';
// Middleware para habilitar el Intercambio de Recursos de Origen Cruzado (CORS).
import cors from 'cors';
// Importación del enrutador principal que agrupa todas las rutas de la API.
import mainRoutes from './routes/index.routes.js';

// --- Inicialización de la Aplicación ---
const app = express();

// --- Configuración de Middlewares Globales ---

// Define la configuración específica para CORS, permitiendo solicitudes solo desde el origen del frontend.
const corsOptions = {
  origin: 'http://localhost:3003'
};
// Aplica el middleware CORS a todas las rutas de la aplicación.
app.use(cors(corsOptions));

// Middleware incorporado de Express para analizar cuerpos de solicitud en formato JSON.
app.use(express.json());

// --- Montaje de Rutas ---
// Monta el enrutador principal en el prefijo '/api'. Todas las rutas definidas en `mainRoutes`
// serán accesibles bajo este prefijo (ej. /api/auth/login).
app.use('/api', mainRoutes);

// Endpoint en la ruta raíz para una verificación básica del estado del servidor.
app.get('/', (req, res) => {
  res.send('¡Backend de Facturación funcionando!');
});

// --- Arranque del Servidor ---
// Se define el puerto para el servidor, priorizando la variable de entorno `PORT`.
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor proxy corriendo en http://localhost:${PORT}`);
});