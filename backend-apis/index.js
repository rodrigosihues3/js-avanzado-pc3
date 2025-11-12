// Cargar las variables de entorno (del .env)
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mainRoutes from './routes/index.routes.js';

// Creación de la aplicación Express
const app = express();

// Configuración de CORS
const corsOptions = {
  // React/Vite correrá en el puerto 3003
  origin: 'http://localhost:3003'
};
app.use(cors(corsOptions));

// Middlewares, permite a Express entender el JSON que envía el frontend
app.use(express.json());

// Rutas (conexión de controladores)
app.use('/api', mainRoutes);

// --- MANEJADOR 404 DE LA API ---
// Se activa si ninguna ruta anterior (en mainRoutes o '/') coincide
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint no encontrado' });
});

// Ruta de prueba para saber que el servidor funciona
app.get('/', (req, res) => {
  res.send('¡Backend de Facturación funcionando!');
});

// Iniciar el Servidor
// Lee el puerto del archivo .env. Si no lo encuentra, usa el 3001.
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor proxy corriendo en http://localhost:${PORT}`);
});