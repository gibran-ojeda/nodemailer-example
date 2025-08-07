# Usa una imagen oficial de Node.js (versión 18 sobre Alpine)
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json (si existiera) para aprovechar el cache de npm
COPY package*.json ./

# Instala solo dependencias de producción
RUN npm install --only=production

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que corre tu app (ajusta si usas otro)
EXPOSE 3000

# Define el comando de arranque
CMD ["npm", "start"]
