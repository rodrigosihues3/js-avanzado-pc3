# --- ETAPA 1: Construcción (La "Cocina" con Node.js) ---
# Usamos la misma imagen de Node que el backend para la consistencia
# Nombramos esta etapa como "builder"
FROM node:18-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copiamos e instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos todo el código fuente de React
COPY . .

# ¡El comando clave! Esto crea la carpeta /app/dist con los archivos estáticos
RUN npm run build

# --- ETAPA 2: Servidor (El "Mostrador" con Nginx) ---
# Empezamos una imagen NUEVA y limpia, solo con el servidor web Nginx
FROM nginx:stable-alpine

# Exponemos el puerto 80 (el puerto estándar de Nginx)
EXPOSE 80

# Copiamos los archivos estáticos (HTML, CSS, JS) desde la etapa 'builder'
# 'builder' es el nombre que le dimos a la Etapa 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia nuestro archivo de configuración personalizado de Nginx
# y reemplaza al que viene por defecto.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# El comando para iniciar el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]