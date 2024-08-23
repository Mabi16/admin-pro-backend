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
app.use( '/api/hospitales', require('./routes/hospitales') );
app.use( '/api/medicos', require('./routes/medicos') );
app.use( '/api/login', require('./routes/auth') );
app.use( '/api/todo', require('./routes/busquedas') );
app.use( '/api/upload', require('./routes/uploads') );


app.listen(process.env.PORT, () => {
    console.log("Servidor corriendo en puerto: " + process.env.PORT);
});







