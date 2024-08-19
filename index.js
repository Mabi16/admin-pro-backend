require("dotenv").config(); //variables de entorno en el archivo .env

const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require("cors");

// Crear el servidor express
const app = express();

// Configurar CORS (permitir peticiones de usuarios)
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );

//Base de datos
dbConnection();

// Rutas
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/login', require('./routes/auth') );


app.listen(process.env.PORT, () => {
    console.log("Servidor corriendo en puerto: " + process.env.PORT);
});







