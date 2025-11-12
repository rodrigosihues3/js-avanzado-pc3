import { consultarRuc } from '../services/decolecta.service.js';

export const getRuc = async (req, res) => {
  try {
    const numeroRuc = req.params.ruc;
    const data = await consultarRuc(numeroRuc);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};