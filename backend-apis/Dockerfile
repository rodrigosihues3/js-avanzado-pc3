# --- 1. Imagen Base ---
# Empezamos con una imagen oficial de Node.js. 
# 'alpine' es una versión ligera de Linux, perfecta para producción.
FROM node:22-alpine

# --- 2. Directorio de Trabajo ---
# Creamos una carpeta dentro del contenedor donde vivirá nuestra app.
WORKDIR /app

# --- 3. Copiar Dependencias ---
# Copiamos solo el package.json y package-lock.json primero.
# Esto aprovecha la caché de Docker: si no cambiamos las dependencias,
# no se volverán a instalar cada vez que construyamos.
COPY package*.json ./

# --- 4. Instalar Dependencias ---
# Ejecutamos npm install para descargar las librerías (express, axios, etc.)
RUN npm install

# --- 5. Copiar el Código Fuente ---
# Copiamos el resto de nuestro código (index.js, routes/, services/, etc.)
COPY . .

# --- 6. Exponer el Puerto ---
# Le decimos a Docker que este contenedor escuchará en el puerto 3002
# (o el puerto que tengas en tu .env).
# OJO: Tu .env dice 3002, así que asegúrate de que coincida.
EXPOSE 3002

# --- 7. Comando de Inicio ---
# El comando que se ejecutará cuando el contenedor arranque.
CMD [ "node", "index.js" ]