import { promises as fs } from 'fs';
import path from 'path';

// Ruta a la base de datos
const DB_PATH = path.resolve('db.json');

// --- Helper para LEER la BD ---
const readDB = async () => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe o está vacío, creamos una estructura base
    return { usuarios: [], productos: [], comprobantes: [] };
  }
};

// --- Helper para ESCRIBIR en la BD ---
const writeDB = async (data) => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// --- Servicios de Usuario ---
export const findUserByEmail = async (email) => {
  const db = await readDB();

  return db.usuarios.find(user => user.email === email);
};

export const findUserByDni = async (dni) => {
  const db = await readDB();

  return db.usuarios.find(user => user.dni === dni);
};

export const createUser = async (newUser) => {
  const db = await readDB();

  // Asignamos un ID simple
  const newId = (db.usuarios.length > 0) ? Math.max(...db.usuarios.map(u => u.id)) + 1 : 1;
  const userWithId = { ...newUser, id: newId };

  db.usuarios.push(userWithId);
  await writeDB(db);

  return userWithId;
};

// --- SERVICIOS DE PRODUCTOS ---
export const createNewProducto = async (productoData) => {
  const db = await readDB();
  const newId = (db.productos.length > 0) ? Math.max(...db.productos.map(p => p.id)) + 1 : 1;
  const newProducto = { ...productoData, id: newId };

  db.productos.push(newProducto);
  await writeDB(db);

  return newProducto;
};

export const getAllProductos = async () => {
  const db = await readDB();

  return db.productos;
};

export const findProductoByNombre = async (nombre) => {
  const db = await readDB();

  return db.productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
};

// --- SERVICIO DE COMPROBANTES ---
export const createComprobante = async (comprobanteData, userId) => {
  const db = await readDB();

  // Asignamos un ID
  const newId = (db.comprobantes.length > 0) ? Math.max(...db.comprobantes.map(c => c.id)) + 1 : 1;

  // Guardamos el comprobante con su ID y el ID del usuario que lo creó
  const newComprobante = { ...comprobanteData, id: newId, userId: userId };

  db.comprobantes.push(newComprobante);
  await writeDB(db);
  return newComprobante;
};

export const getAllComprobantes = async () => {
  const db = await readDB();
  return db.comprobantes.sort((a, b) => b.id - a.id); // Orden descendente
};

export const getComprobanteById = async (id) => {
  const db = await readDB();
  const comprobante = db.comprobantes.find(c => c.id === parseInt(id));
  if (!comprobante) {
    throw new Error('Comprobante no encontrado');
  }
  return comprobante;
};