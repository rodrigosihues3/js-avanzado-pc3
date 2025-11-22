import { consultarTipoCambio } from '../services/decolecta.service.js';

// --- Controlador para obtener el tipo de cambio del día (SUNAT) ---
export const getTipoCambio = async (req, res) => {
  try {
    // Se invoca al servicio `consultarTipoCambio` que realiza la petición a la API externa.
    const data = await consultarTipoCambio();
    // Si la consulta es exitosa, se responde al cliente con los datos obtenidos en formato JSON.
    res.json(data);
  } catch (error) {
    // Si ocurre un error durante la llamada al servicio (ej. la API no está disponible),
    // se envía una respuesta con código 500 (Internal Server Error) y el mensaje de error correspondiente.
    res.status(500).json({ message: error.message });
  }
};