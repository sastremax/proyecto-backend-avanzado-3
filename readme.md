# Backend Ecommerce - Proyecto Final Coderhouse

Proyecto de backend para un sistema de ecommerce desarrollado durante la diplomatura de Backend I, II y III en Coderhouse.


## Tecnologías utilizadas

Node.js
Express.js
MongoDB + Mongoose
JWT + Passport
Docker + Docker Compose
Kubernetes (kube-backend.yaml)
Swagger (documentación de API)
Mocha (tests)
Artillery (pruebas de carga)


## Instalación local

1. Clonar el repositorio
2. Instalar dependencias:

npm install

3. Configurar variables de entorno:

cp .env.template .env.dev

4. Ejecutar en modo desarrollo:

npm run dev


## Documentación Swagger

Acceder a la documentación en:

http://localhost:8080/apidocs

Incluye endpoints para:

Autenticación (login, register, current, forgot-password, reset-password)
Productos
Carritos
Tickets
Órdenes
Usuarios


## Scripts disponibles

### Desarrollo

npm run dev

### Producción

npm run prod

### Testing (Mocha)

npm test

### Carga (Artillery)

npx artillery run artillery/products.yml


## Docker

### Crear imagen

docker build -t sastrebocalonmaxi/backend3:1.1 .

### Ejecutar contenedor

docker run -p 8080:8080 sastrebocalonmaxi/backend3:1.1

### Verificar

GET http://localhost:8080/api/ping


## Docker Compose

Levantar entorno completo:

docker-compose up --build


## Kubernetes

Archivo de despliegue:

kubectl apply -f kube-backend.yaml


## Variables de entorno importantes

Revisar `.env.template`. Algunas claves:

`PORT=8080`
`MONGO_URI` por entorno
`JWT_SECRET`
`MAIL_USER` / `MAIL_PASS`
`TWILIO_SID` / `TWILIO_TOKEN` / `TWILIO_PHONE`


## Usuario Admin para pruebas

Email: [sastrebocalonmaximiliano@example.com](mailto:sastrebocalonmaximiliano@example.com)
Password: 12345678
Rol: admin


## Autor

Maximiliano Sastre Bocalon - Proyecto final para Backend III en Coderhouse -
