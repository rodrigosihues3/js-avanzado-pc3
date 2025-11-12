import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'miclavesecreta123';

const authMiddleware = (req, res, next) => {
  try {
    // 1. Obtener el token del header
    const authHeader = req.headers['authorization']; // Formato: "Bearer TOKEN"
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      return res.status(401).json({ message: 'Acceso denegado: No hay token.' });
    }

    // 2. Verificar el token
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Acceso denegado: Token no válido.' });
      }

      // 3. Si es válido, guardamos el usuario en la petición y continuamos
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Error de autenticación.' });
  }
};

export default authMiddleware;