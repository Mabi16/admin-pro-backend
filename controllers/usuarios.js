const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");



const getUsuarios = async (req, res) => {

    const usuario = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios: usuario,
        uid:req.uid
    });

};

const crearUsuario = async (req, res = response) => {

    const { email, password, nombre } = req.body;



    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: "El correo ya esta registrado"
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // GUARDAR USUARIO EN BD
        await usuario.save();

        const token = await generarJWT(usuario.id)


        res.json({
            ok: true,
            usuario,
            token
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error Inesperado... revisar logs"
        });
    }

};

const actualizarUsuario = async (req, res = response) => {
    // TODO: VALIDAR TOKEN 

    const uid = req.params.id;


    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {

            return res.status(404).json({
                ok: false,
                msg: "No existe un usuario por ese id"
            })

        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: "Ya existe un usuario con ese email."
                })
            }
        }
        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });



        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    }
    catch (error) {

        res.status(500).json({
            ok: false,
            msg: "Error Inesperado"
        });

    }
}

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {

            return res.status(404).json({
                ok: false,
                msg: "No existe un usuario por ese id"
            })

        }


        const usuarioEliminado = await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            uid,
            usuario: usuarioEliminado
        });




    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: "Error Inesperado"
        });

    }


}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
};