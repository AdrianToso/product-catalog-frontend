# Usamos la imagen oficial de Node.js 20 con Alpine (ligera)
FROM node:20-alpine AS development

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos de dependencias primero para aprovechar el cache de Docker
COPY package*.json ./

# Instalamos las dependencias (incluyendo devDependencies)
RUN npm ci

# Copiamos el resto del código de la aplicación
COPY . .

# Exponemos el puerto que usa Angular en desarrollo
EXPOSE 4200

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
