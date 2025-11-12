import { createComprobante, getAllComprobantes, getComprobanteById } from '../services/user.service.js';

export const postComprobante = async (req, res) => {
  try {
    // Obtenemos los datos del comprobante desde el body
    const comprobanteData = req.body;

    const nuevoComprobante = await createComprobante(comprobanteData);
    res.status(201).json(nuevoComprobante);
  } catch (error) {
    console.error('Error al crear comprobante:', error.message);
    res.status(500).json({ message: 'Error en el servidor al guardar.' });
  }
};

export const getComprobantes = async (req, res) => {
  try {
    const comprobantes = await getAllComprobantes();
    res.json(comprobantes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comprobantes' });
  }
};

export const getComprobante = async (req, res) => {
  try {
    const id = req.params.id;
    const comprobante = await getComprobanteById(id);
    res.json(comprobante);
  } catch (error) {
    // Si el servicio lanza el error 'Comprobante no encontrado'
    if (error.message === 'Comprobante no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
};