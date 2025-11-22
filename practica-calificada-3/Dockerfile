# ETAPA 1: Construcción del proyecto React.
# Se utiliza una imagen de Node.js para construir la aplicación.
# Esta etapa se nombra "builder" para poder referenciarla luego.
FROM node:22-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copia los archivos de dependencias e instala los paquetes de Node.
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente de la aplicación.
COPY . .

# Ejecuta el script de build para generar los archivos estáticos de producción.
RUN npm run build

# ETAPA 2: Servidor web para producción.
# Se utiliza una imagen ligera de Nginx para servir los archivos.
FROM nginx:stable-alpine

# Expone el puerto 80 para permitir el tráfico HTTP.
EXPOSE 80

# Copia los archivos estáticos generados en la etapa "builder".
COPY --from=builder /app/dist /usr/share/nginx/html

# Reemplaza la configuración por defecto de Nginx con una personalizada.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Comando para iniciar el servidor Nginx cuando el contenedor se ejecute.
CMD ["nginx", "-g", "daemon off;"]