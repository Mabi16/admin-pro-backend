const path = require("path")
const { request, response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { actualizarImagen } = require("../helpers/actualizar-imagen");
const fs = require('fs');


const fileUpload = (req = request, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {

        return res.status(400).json({
            ok: false,
            msg: "No es un medico, usuario u hospital (tipo)"
        });

    }
    console.log(req.files);
    
    if (!req.files || Object.keys(req.files).length === 0) {

        return res.status(400).json({
            ok: false,
            msg: "no hay ningun archivo en la peticion1.",
            arch:req.files
        });

    }

    const file = req.files.imagen;
    const nombreCortado = file.name.split(".");
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: "No es una extension permitida"
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`; // uuidv4() = cf2a596a-b111-4c95-a0a6-85b4220f0616

    //  Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(path, (err) => {
        if (err) {

            console.log(err);

            return res.status(500).json({
                ok: false,
                msg: "Error al mover la imagen"
            });
        }

        // Actualizar base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: "Archivo subido",
            nombreArchivo
        });
    });



}

const retornaImagen = (req,res = response) =>{
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${tipo}/${foto}`);
    console.table([__dirname,path.join( __dirname, `../uploads/${tipo}/${foto}`)]);

    // imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else{
        const pathImg = path.join(__dirname,'../uploads/no-img.jpg');
        res.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    retornaImagen
}