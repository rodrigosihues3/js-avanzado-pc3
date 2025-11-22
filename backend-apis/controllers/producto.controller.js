import { getAllProductos, createNewProducto, findProductoByNombre } from '../services/user.service.js';

// --- Controlador para OBTENER TODOS los productos ---
export const getProductos = async (req, res) => {
  try {
    // Se invoca al servicio `getAllProductos` para recuperar la lista completa desde la base de datos.
    const productos = await getAllProductos();

    // Se responde al cliente con la lista de productos en formato JSON.
    res.json(productos);
  } catch (error) {
    // En caso de error durante la consulta, se responde con un estado 500 (Internal Server Error).
    res.status(500).json({ message: 'Error al obtener productos: ' + error.message });
  }
};

// --- Controlador para CREAR un nuevo producto ---
export const createProducto = async (req, res) => {
  try {
    // Se extrae la propiedad 'nombre' del cuerpo de la solicitud para realizar validaciones.
    const { nombre } = req.body;

    // Validación 1: Asegurar que el nombre del producto no esté vacío o solo contenga espacios.
    if (!nombre || nombre.trim() === '') {
      // Si la validación falla, se devuelve un error 400 (Bad Request).
      return res.status(400).json({ message: 'El nombre del producto no puede estar vacío' });
    }

    // Validación 2: Verificar si ya existe un producto con el mismo nombre para evitar duplicados.
    // Se utiliza el servicio `findProductoByNombre` para la búsqueda.
    const existingProduct = await findProductoByNombre(nombre);
    if (existingProduct) {
      // Si se encuentra un producto existente, se devuelve un error 400 (Bad Request).
      return res.status(400).json({ message: 'Ya existe un producto con ese nombre' });
    }

    // Si las validaciones son exitosas, se invoca al servicio `createNewProducto`.
    // Se le pasa el cuerpo completo de la solicitud (`req.body`) para crear el nuevo registro.
    const nuevoProducto = await createNewProducto(req.body);

    // Se responde con un estado 201 (Created) y el objeto del producto recién creado.
    res.status(201).json(nuevoProducto);
  } catch (error) {
    // Si ocurre un error inesperado durante el proceso, se responde con un estado 500.
    res.status(500).json({ message: 'Error al crear el producto' });
  }
};