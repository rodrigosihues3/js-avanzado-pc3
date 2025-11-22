# --- Etapa 1: Definición de la imagen base ---
# Se utiliza una imagen oficial de Node.js con la etiqueta 'alpine'.
# Alpine Linux es una distribución ligera, lo que resulta en una imagen final de menor tamaño,
# optimizando el despliegue y el uso de recursos.
FROM node:22-alpine

# --- Etapa 2: Configuración del entorno de trabajo ---
# Se establece el directorio de trabajo dentro del contenedor en '/app'.
# Todas las instrucciones subsiguientes (COPY, RUN, CMD) se ejecutan en este contexto.
WORKDIR /app

# --- Etapa 3: Instalación de dependencias ---
# Se copian los archivos de manifiesto de dependencias. Esta acción se realiza por separado
# para aprovechar el sistema de caché por capas de Docker. Si estos archivos no cambian,
# la capa de instalación de dependencias no se reconstruirá, acelerando builds futuros.
COPY package*.json ./

# Se ejecuta 'npm install' para descargar e instalar todas las dependencias definidas en package.json.
RUN npm install

# --- Etapa 4: Copia del código fuente de la aplicación ---
# Se copia el resto de los archivos de la aplicación al directorio de trabajo del contenedor.
COPY . .

# --- Etapa 5: Exposición del puerto ---
# La instrucción EXPOSE documenta que el contenedor escuchará en el puerto 3002 en tiempo de ejecución.
# No publica el puerto, pero sirve como información para el desarrollador y otras herramientas.
EXPOSE 3002

# --- Etapa 6: Definición del comando de ejecución ---
# Comando por defecto que se ejecutará al iniciar el contenedor.
# En este caso, inicia la aplicación Node.js.
CMD [ "node", "index.js" ]