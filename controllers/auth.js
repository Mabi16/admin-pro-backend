const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const login = async (req, res = response) => 
{
    const {email, password} = req.body;
    try 
    {

        // Verificar email
        const usuarioBD = await Usuario.findOne({ email });


        if ( !usuarioBD ) {
            return res.status(404).json({
                ok: false,
                msg:"email no valida"
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return res.status(404).json({
                ok:false,
                msg:"contraseña no valida"
            })
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioBD._id);
        
        res.json({
            ok:true,
            token
        });

    }
    catch (error) 
    {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
}


module.exports = {
    login
}