import { consultarDni } from '../services/decolecta.service.js';

// --- Controlador para obtener datos de una persona por su DNI (Reniec) ---
export const getDni = async (req, res) => {
  try {
    // Se extrae el número de DNI de los parámetros de la ruta de la URL (ej: /api/reniec/12345678).
    const numeroDni = req.params.dni;
    // Se invoca al servicio `consultarDni`, pasándole el número a consultar.
    const data = await consultarDni(numeroDni);
    // Si la consulta es exitosa, se responde al cliente con los datos obtenidos.
    res.json(data);
  } catch (error) {
    // En caso de que el servicio falle (ej: DNI no encontrado, API externa caída),
    // se captura el error y se responde con un estado 500 (Internal Server Error).
    res.status(500).json({ message: error.message });
  }
};