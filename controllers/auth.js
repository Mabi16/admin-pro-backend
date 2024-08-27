const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {

        // Verificar email
        const usuarioBD = await Usuario.findOne({ email });


        if (!usuarioBD) {
            return res.status(404).json({
                ok: false,
                msg: "email no valida"
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: "contraseña no valida"
            })
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioBD._id);

        res.json({
            ok: true,
            token
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
}


const googleSignIn = async (req = request, res = response) => {

    try {

        const { email, name, picture, ...googleUser } = await googleVerify(req.body.token);

        const usuarioDB = await Usuario.findOne({email});

        let usuario;

        if(!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: "@@@",
                img: picture,
                google: true
            });
        }else{
            usuario = usuarioDB;
            usuario.google = true;
            // usuario.password = "@@";
        }

        // Guardar Usuario
        await usuario.save();

        // Generar el token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            email,
            name,
            picture,
            //googleUser,
            token
        });



    } catch (error) {

        console.log(error);

        res.status(400).json({
            ok: false,
            msg: "token de google no es correcto"
        });

    }



}


module.exports = {
    login,
    googleSignIn
}