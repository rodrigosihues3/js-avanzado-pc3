import { consultarDni } from '../services/decolecta.service.js';

export const getDni = async (req, res) => {
  try {
    const numeroDni = req.params.dni;
    const data = await consultarDni(numeroDni);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};