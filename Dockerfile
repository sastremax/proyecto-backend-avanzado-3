# Imagen base con Node.js
FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copio package.json y package-lock.json
COPY package*.json ./

# Instalo dependencias
RUN npm install

# Copio el resto del proyecto
COPY . .

# Expongo el puerto que usa tu backend
EXPOSE 8080

# Comando para ejecutar el backend
CMD ["npm", "run", "dev"]