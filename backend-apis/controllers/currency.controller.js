import { consultarTipoCambio } from '../services/decolecta.service.js';

export const getTipoCambio = async (req, res) => {
  try {
    const data = await consultarTipoCambio();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};