import { getAllProductos, createNewProducto, findProductoByNombre } from '../services/user.service.js';

export const getProductos = async (req, res) => {
  try {
    const productos = await getAllProductos();

    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos: ' + error.message });
  }
};

export const createProducto = async (req, res) => {
  try {
    const { nombre } = req.body;

    // Validar que el nombre del producto no este vacio
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ message: 'El nombre del producto no puede estar vacío' });
    }

    // Validar que el producto es nuevo y no existe
    const existingProduct = await findProductoByNombre(nombre);
    if (existingProduct) {
      return res.status(400).json({ message: 'Ya existe un producto con ese nombre' });
    }

    const nuevoProducto = await createNewProducto(req.body);

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto' });
  }
};