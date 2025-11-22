// Importación de los servicios necesarios para la gestión de comprobantes.
// Estas funciones abstraen la lógica de acceso a la base de datos.
import { createComprobante, getAllComprobantes, getComprobanteById } from '../services/user.service.js';

// --- Controlador para CREAR un nuevo comprobante ---
export const postComprobante = async (req, res) => {
  try {
    // Se extraen los datos del nuevo comprobante desde el cuerpo (body) de la solicitud HTTP.
    const comprobanteData = req.body;

    // Se invoca el servicio `createComprobante` para persistir los datos.
    // Este servicio se encarga de la lógica de creación y guardado.
    const nuevoComprobante = await createComprobante(comprobanteData);

    // Si la creación es exitosa, se responde con el código de estado 201 (Created)
    // y se devuelve el objeto del comprobante recién creado, que ya incluye su ID.
    res.status(201).json(nuevoComprobante);
  } catch (error) {
    // En caso de un error durante el proceso, se registra en la consola para depuración.
    console.error('Error al crear comprobante:', error.message);
    // Se envía una respuesta con código 500 (Internal Server Error) al cliente.
    res.status(500).json({ message: 'Error en el servidor al guardar.' });
  }
};

// --- Controlador para OBTENER TODOS los comprobantes ---
export const getComprobantes = async (req, res) => {
  try {
    // Se llama al servicio `getAllComprobantes` para recuperar la lista completa.
    const comprobantes = await getAllComprobantes();
    // Se responde al cliente con la lista de comprobantes en formato JSON.
    res.json(comprobantes);
  } catch (error) {
    // Si ocurre un error durante la obtención de datos, se notifica al cliente.
    res.status(500).json({ message: 'Error al obtener comprobantes' });
  }
};

// --- Controlador para OBTENER UN SOLO comprobante por su ID ---
export const getComprobante = async (req, res) => {
  try {
    // El ID se extrae de los parámetros de la URL (por ejemplo, /api/comprobante/123).
    const id = req.params.id;
    // Se utiliza el servicio `getComprobanteById` para buscar el recurso específico.
    const comprobante = await getComprobanteById(id);
    res.json(comprobante);
  } catch (error) {
    // Manejo de error específico: si el servicio lanza un error indicando
    // que el comprobante no fue encontrado, se devuelve un estado 404 (Not Found).
    if (error.message === 'Comprobante no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    // Para cualquier otro tipo de error inesperado, se devuelve un 500 (Internal Server Error).
    res.status(500).json({ message: 'Error en el servidor' });
  }
};