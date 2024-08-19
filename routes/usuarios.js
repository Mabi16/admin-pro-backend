/** 
 * RUTA: /api/usuarios 
 * */
const { Router } = require('express');
const { getUsuarios, crearUsuario, actualizarUsuario,borrarUsuario } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require ("../middlewares/validar-campos");
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.get("/", validarJWT, getUsuarios);

router.post("/",
    [
        validarJWT,
        check('nombre',"El nombre es obligatorio").not().isEmpty(), // Paquete express-validator
        check('password',"La contraseña es obligatoria").not().isEmpty(), 
        check('email',"El email es obligatorio").isEmail(),
        validarCampos
    ],
    crearUsuario
);

router.put('/:id',
    [
        validarJWT,
        check('nombre',"El nombre es obligatorio").not().isEmpty(), // Paquete express-validator
        check('email',"El email es obligatorio").isEmail(),
        // check('role',"El Role es obligatorio").not().isEmpty(),
        validarCampos
    ],
    actualizarUsuario
);

router.delete('/:id',borrarUsuario)

module.exports = router;


