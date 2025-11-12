import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, findUserByDni, createUser } from '../services/user.service.js';

// Clave secreta para firmar los tokens
const JWT_SECRET = process.env.JWT_SECRET || 'miclavesecreta123';

export const register = async (req, res) => {
  try {
    const { nombres, apellidos, dni, email, password } = req.body;

    // Validar que el usuario no exista
    if (await findUserByDni(dni)) {
      return res.status(400).json({ message: 'El DNI ya se encuentra registrado.' });
    }
    if (await findUserByEmail(email)) {
      return res.status(400).json({ message: 'El email ya se encuentra registrado.' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
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

    res.status(201).json({ message: 'Usuario registrado con éxito', userId: user.id });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al registrar', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar al usuario por email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas (email).' });
    }

    // 2. Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas (password).' });
    }

    // 3. Crear el Token (JWT)
    const payload = {
      userId: user.id,
      email: user.email
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expira en 1 hora

    res.json({
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
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión', error: error.message });
  }
};