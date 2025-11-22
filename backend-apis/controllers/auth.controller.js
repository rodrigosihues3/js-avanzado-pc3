import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, findUserByDni, createUser } from '../services/user.service.js';

// Definicion de la clave secreta para el token JWT
// Lo ideal es que esto venga de una variable de entorno (`process.env.JWT_SECRET`),
// pero le pongo un valor por defecto por si no la defino ahí.
const JWT_SECRET = process.env.JWT_SECRET || 'miclavesecreta123';

// --- Controlador para registrar un nuevo usuario ---
export const register = async (req, res) => {
  try {
    // Datos que el usuario me envía en el cuerpo de la petición.
    const { nombres, apellidos, dni, email, password } = req.body;

    // Validar que el usuario no exista
    if (await findUserByDni(dni)) {
      return res.status(400).json({ message: 'El DNI ya se encuentra registrado.' });
    }
    if (await findUserByEmail(email)) {
      return res.status(400).json({ message: 'El email ya se encuentra registrado.' });
    }

    // Encriptar la contraseña
    // `genSalt(10)` crea una "sal", que es un texto aleatorio para hacer el hash más seguro.
    const salt = await bcrypt.genSalt(10);
    // `hash` combina la contraseña del usuario con la "sal" para generar el hash final.
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const newUser = {
      nombres,
      apellidos,
      dni,
      email,
      password: hashedPassword // Guardamos el hash, no la contraseña
    };

    const user = await createUser(newUser);

    // Si todo esta bien, la respuesta al cliente es un código 201 (Creado) y un mensaje.
    res.status(201).json({ message: 'Usuario registrado con éxito', userId: user.id });

  } catch (error) {
    // Si algo falla dentro del `try`, el código salta a este `catch`.
    // La respuesta al cliente es que hubo un error en el servidor (código 500).
    res.status(500).json({ message: 'Error en el servidor al registrar', error: error.message });
  }
};

// --- Controlador para el inicio de sesión ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas (email).' });
    }

    // Compara la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Si no coinciden, devuelvo un error 401 (No autorizado).
      return res.status(401).json({ message: 'Credenciales incorrectas (password).' });
    }

    // Si las credenciales son correctas, creo un Token (JWT) para el usuario.
    // El "payload" es la información que se guarda dentro del token.
    const payload = {
      userId: user.id,
      email: user.email
    };

    // Firmo el token con mi clave secreta y le pongo una fecha de expiración.
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expira en 1 hora

    res.json({
      // Se devuelve al cliente un mensaje, el token y algunos datos del usuario (sin la contraseña).
      message: 'Login exitoso',
      token: token,
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        dni: user.dni,
        email: user.email
      }
    });

  } catch (error) {
    // Si algo falla, se envia un mensaje al cliente que hubo un problema en mi servidor.
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión', error: error.message });
  }
};