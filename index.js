require("dotenv").config(); //variables de entorno en el archivo .env

const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require("cors");

// Crear el servidor express
const app = express();

// Configurar CORS (permitir peticiones de usuarios)
app.use( cors() );

//Base de datos
dbConnection();

// Rutas
app.get("/", (req, res) => {

    res.json({
        ok: true,
        msg: "Hola Mundo"
    });

});


app.listen(process.env.PORT, () => {
    console.log("Servidor corriendo en puerto: " + process.env.PORT);
});







