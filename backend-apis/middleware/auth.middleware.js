// Importación de la librería jsonwebtoken para verificar los tokens de acceso.
import jwt from 'jsonwebtoken';

// Definición de la clave secreta para JWT. Se obtiene de las variables de entorno
// o se usa un valor por defecto si no está definida.
const JWT_SECRET = process.env.JWT_SECRET || 'miclavesecreta123';

// --- Middleware de autenticación ---
// Un middleware es una función que se ejecuta entre la petición del cliente y la respuesta del servidor.
// Su propósito es verificar si el usuario tiene permiso para acceder a una ruta protegida.
const authMiddleware = (req, res, next) => {
  try {
    // 1. Obtener el token del encabezado 'Authorization'.
    // El formato esperado es "Bearer TOKEN".
    const authHeader = req.headers['authorization']; // Formato: "Bearer TOKEN"
    const token = authHeader && authHeader.split(' ')[1];

    // Si no se proporciona un token, se deniega el acceso con un error 401 (Unauthorized).
    if (token == null) {
      return res.status(401).json({ message: 'Acceso denegado: No hay token.' });
    }

    // 2. Verificar la validez del token usando la clave secreta.
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        // Si el token es inválido (expirado, malformado, etc.), se deniega el acceso con un error 403 (Forbidden).
        return res.status(403).json({ message: 'Acceso denegado: Token no válido.' });
      }

      // 3. Si el token es válido, se adjunta la información decodificada del usuario (payload) al objeto `req`.
      // Esto permite que los siguientes controladores tengan acceso a los datos del usuario autenticado.
      req.user = user;
      // Se llama a `next()` para pasar el control al siguiente middleware o al controlador de la ruta.
      next();
    });
  } catch (error) {
    // Captura cualquier otro error inesperado durante el proceso y devuelve un error 401.
    res.status(401).json({ message: 'Error de autenticación.' });
  }
};

export default authMiddleware;