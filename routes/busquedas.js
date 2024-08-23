/*

    ruta: api/todo/:busqueda
*/


/*
    RUTA: /api/hospitales/
*/


/** 
 * RUTA: /api/usuarios 
 * */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require('../middlewares/validar-jwt');
const { buscarEnTodo, getDocumentosColeccion } = require('../controllers/busquedas');

const router = Router();


router.get("/:busqueda", [validarJWT], buscarEnTodo);

router.get("/coleccion/:tabla/:busqueda", [validarJWT], getDocumentosColeccion);


module.exports = router;



