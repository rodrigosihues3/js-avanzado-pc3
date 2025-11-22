import { consultarRuc } from '../services/decolecta.service.js';

// --- Controlador para obtener datos de una empresa por su RUC (SUNAT) ---
export const getRuc = async (req, res) => {
  try {
    // Se obtiene el número de RUC desde los parámetros de la URL (ej: /api/sunat/20123456789).
    const numeroRuc = req.params.ruc;
    // Se llama al servicio `consultarRuc` para realizar la búsqueda de la información.
    const data = await consultarRuc(numeroRuc);
    // Se devuelve la información encontrada al cliente en formato JSON.
    res.json(data);
  } catch (error) {
    // Si se produce un error durante la consulta, se responde al cliente
    // con un código 500 (Internal Server Error) y el mensaje del error.
    res.status(500).json({ message: error.message });
  }
};