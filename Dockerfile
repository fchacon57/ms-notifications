# 1. Imagen base: Usamos una versión ligera de Node.js
FROM node:18-alpine

# 2. Directorio de trabajo: Donde vivirá la app dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias para instalarlas
COPY package*.json ./
RUN npm install

# 4. Copiamos todo el código del microservicio
COPY . .

# 5. Exponemos el puerto que configuramos (5001)
EXPOSE 5001

# 6. Comando para iniciar la aplicación
CMD ["node", "src/server.js"]