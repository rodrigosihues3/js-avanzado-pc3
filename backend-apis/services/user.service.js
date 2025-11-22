// Importación del módulo 'fs' (File System) con promesas para operaciones asíncronas de archivos.
import { promises as fs } from 'fs';
// Importación del módulo 'path' para manejar rutas de archivos de forma segura entre sistemas operativos.
import path from 'path';

// Se define la ruta absoluta al archivo JSON que funciona como base de datos.
const DB_PATH = path.resolve('db.json');

// --- Función auxiliar para leer el contenido de la base de datos ---
const readDB = async () => {
  try {
    // Lee el archivo de forma asíncrona con codificación utf-8.
    const data = await fs.readFile(DB_PATH, 'utf-8');
    // Parsea el contenido JSON a un objeto de JavaScript.
    return JSON.parse(data);
  } catch (error) {
    // Si ocurre un error (ej. el archivo no existe), se devuelve una estructura de BD por defecto.
    // Esto previene fallos en la primera ejecución de la aplicación.
    return { usuarios: [], productos: [], comprobantes: [] };
  }
};

// --- Función auxiliar para escribir datos en la base de datos ---
const writeDB = async (data) => {
  // Escribe el objeto de datos en el archivo JSON, formateado con 2 espacios de indentación para legibilidad.
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// --- Servicios de Usuario ---

// Busca un usuario por su dirección de correo electrónico.
export const findUserByEmail = async (email) => {
  const db = await readDB();
  return db.usuarios.find(user => user.email === email);
};

// Busca un usuario por su número de DNI.
export const findUserByDni = async (dni) => {
  const db = await readDB();
  return db.usuarios.find(user => user.dni === dni);
};

// Crea un nuevo usuario en la base de datos.
export const createUser = async (newUser) => {
  const db = await readDB();

  // Genera un nuevo ID autoincremental para el usuario.
  const newId = (db.usuarios.length > 0) ? Math.max(...db.usuarios.map(u => u.id)) + 1 : 1;
  const userWithId = { ...newUser, id: newId };

  db.usuarios.push(userWithId);
  await writeDB(db);
  return userWithId;
};

// --- SERVICIOS DE PRODUCTOS ---

// Crea un nuevo producto.
export const createNewProducto = async (productoData) => {
  const db = await readDB();
  // Genera un nuevo ID autoincremental para el producto.
  const newId = (db.productos.length > 0) ? Math.max(...db.productos.map(p => p.id)) + 1 : 1;
  const newProducto = { ...productoData, id: newId };

  db.productos.push(newProducto);
  await writeDB(db);
  return newProducto;
};

// Obtiene todos los productos registrados.
export const getAllProductos = async () => {
  const db = await readDB();
  return db.productos;
};

// Busca un producto por su nombre (insensible a mayúsculas/minúsculas).
export const findProductoByNombre = async (nombre) => {
  const db = await readDB();
  return db.productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
};

// --- SERVICIO DE COMPROBANTES ---

// Crea un nuevo registro de comprobante.
export const createComprobante = async (comprobanteData, userId) => {
  const db = await readDB();

  // Genera un nuevo ID autoincremental para el comprobante.
  const newId = (db.comprobantes.length > 0) ? Math.max(...db.comprobantes.map(c => c.id)) + 1 : 1;

  // Asocia el comprobante con el ID del usuario que lo creó.
  const newComprobante = { ...comprobanteData, id: newId, userId: userId };

  db.comprobantes.push(newComprobante);
  await writeDB(db);
  return newComprobante;
};

// Obtiene todos los comprobantes, ordenados del más reciente al más antiguo.
export const getAllComprobantes = async () => {
  const db = await readDB();
  return db.comprobantes.sort((a, b) => b.id - a.id);
};

// Busca un comprobante específico por su ID.
export const getComprobanteById = async (id) => {
  const db = await readDB();
  // Compara el ID convirtiendo el parámetro (que puede ser string) a número.
  const comprobante = db.comprobantes.find(c => c.id === parseInt(id));
  if (!comprobante) {
    // Si no se encuentra, lanza un error para ser manejado por el controlador.
    throw new Error('Comprobante no encontrado');
  }
  return comprobante;
};